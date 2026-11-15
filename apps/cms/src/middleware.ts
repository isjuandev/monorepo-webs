import { defineMiddleware } from "astro:middleware";
import { LABELS } from "@/data/labels";
import { SESSION_COOKIE } from "@/lib/http/cookies.ts";
import { isPageRequest, isPublicPath } from "@/lib/http/public-paths.ts";
import {
  BodyTooLargeError,
  exceedsDeclared,
  FORM_BODY_MAX_BYTES,
  readBodyLimited,
} from "@/lib/http/read-body.ts";
import { verifySessionCsrf } from "@/lib/security/csrf.ts";
import { getRuntime } from "@/lib/security/runtime.ts";
import { unsign } from "@/lib/security/signing.ts";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const LOGIN_ENDPOINT = "/api/sesion/iniciar";

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  "Strict-Transport-Security": "max-age=31536000",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withHeaders(response: Response, noStore: boolean): Response {
  // Se clona siempre: algunas respuestas (Response.redirect, fetch) tienen cabeceras inmutables y
  // así no depende de detectarlo. El cuerpo se reutiliza sin copiarlo.
  const target = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) target.headers.set(name, value);
  if (noStore) target.headers.set("Cache-Control", "no-store");
  return target;
}

/** Token CSRF de la petición (cabecera o campo `_csrf`). Lanza BodyTooLargeError si se pasa del tope. */
async function providedCsrf(request: Request): Promise<string> {
  const header = request.headers.get("x-csrf-token");
  if (header) return header;
  const type = request.headers.get("content-type") ?? "";
  if (!type.startsWith("application/x-www-form-urlencoded")) return "";
  const text = await readBodyLimited(request.clone(), FORM_BODY_MAX_BYTES);
  return new URLSearchParams(text).get("_csrf") ?? "";
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, locals, url } = context;
  const path = url.pathname;
  const isApi = path.startsWith("/api/");

  const state = getRuntime();
  if (!state.ok) {
    // /healthz responde por sí mismo (503 sin detalles).
    if (path === "/healthz" || path === "/healthz/") return withHeaders(await next(), true);
    return withHeaders(new Response(LABELS.errors.unavailable, { status: 503 }), true);
  }
  const { config, sessions } = state.runtime;

  const unsafe = !SAFE_METHODS.has(request.method);
  // Fase 2: el tope pasará a ser por ruta (subidas de imágenes con límite propio, en streaming y solo con sesión); el global de 8 KiB quedará para formularios.
  // Tope de cuerpo por Content-Length antes de cualquier otra cosa (sin sesión incluida).
  if (unsafe && exceedsDeclared(request.headers, FORM_BODY_MAX_BYTES)) {
    return withHeaders(new Response(LABELS.errors.payloadTooLarge, { status: 413 }), true);
  }

  const raw = cookies.get(SESSION_COOKIE)?.value;
  const sessionId = raw ? unsign(raw, config.sessionSecret) : null;
  locals.session = sessionId ? sessions.get(sessionId) : null;
  const session = locals.session;

  if (!session && !isPublicPath(path)) {
    // Solo las páginas redirigen a /login; favicon, imágenes y demás reciben 401.
    const wantsRedirect = !isApi && isPageRequest(path, request.headers.get("accept"));
    const response = wantsRedirect
      ? context.redirect("/login", 303)
      : Response.json({ error: LABELS.errors.unauthorized }, { status: 401 });
    return withHeaders(response, true);
  }

  if (session && unsafe && path !== LOGIN_ENDPOINT) {
    try {
      if (!verifySessionCsrf(session, await providedCsrf(request))) {
        return withHeaders(new Response(LABELS.errors.forbidden, { status: 403 }), true);
      }
    } catch (error) {
      if (!(error instanceof BodyTooLargeError)) throw error;
      // La lectura fue sobre un clon (tee): hay que cancelar también la rama original para que
      // el origen deje de leer del socket.
      request.body?.cancel().catch(() => undefined);
      return withHeaders(new Response(LABELS.errors.payloadTooLarge, { status: 413 }), true);
    }
  }

  const response = await next();
  const isPageWithoutSession = path === "/login" || path === "/login/";
  return withHeaders(response, session !== null || isPageWithoutSession);
});
