import type { APIRoute } from "astro";
import { LABELS } from "@/data/labels";
import { resolveClientIp } from "@/lib/http/client-ip.ts";
import {
  DELETE_COOKIE_OPTIONS,
  LOGIN_CSRF_COOKIE,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/http/cookies.ts";
import { BodyTooLargeError, FORM_BODY_MAX_BYTES, readBodyLimited } from "@/lib/http/read-body.ts";
import { verifyLoginCsrf } from "@/lib/security/csrf.ts";
import { attemptLogin } from "@/lib/security/login-attempt.ts";
import { verifyCredentials } from "@/lib/security/passwords.ts";
import { getRuntime } from "@/lib/security/runtime.ts";
import { sign, unsign } from "@/lib/security/signing.ts";

export const prerender = false;

const MAX_FIELD_LENGTH = 1024;

function field(form: URLSearchParams, name: string): string {
  const value = form.get(name) ?? "";
  return value.length <= MAX_FIELD_LENGTH ? value : "";
}

export const POST: APIRoute = async ({ request, cookies, clientAddress, redirect }) => {
  const state = getRuntime();
  if (!state.ok) return new Response(LABELS.errors.unavailable, { status: 503 });
  const { config, sessions, userLimiter, ipLimiter } = state.runtime;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("application/x-www-form-urlencoded")) {
    return new Response(LABELS.errors.forbidden, { status: 403 });
  }
  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await readBodyLimited(request, FORM_BODY_MAX_BYTES));
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return new Response(LABELS.errors.payloadTooLarge, { status: 413 });
    }
    throw error;
  }

  // CSRF del login. Se redirige (no 403) para que quien tenga el token caducado vea un mensaje.
  const csrfCookie = cookies.get(LOGIN_CSRF_COOKIE)?.value ?? "";
  if (!verifyLoginCsrf(csrfCookie, field(form, "_csrf"), config.sessionSecret)) {
    return redirect("/login?error=csrf", 303);
  }

  const username = field(form, "username");
  const result = await attemptLogin({
    username,
    password: field(form, "password"),
    ipKey: `ip:${resolveClientIp(clientAddress, request.headers, config.trustProxy)}`,
    userExists: config.users.has(username),
    userLimiter,
    ipLimiter,
    verify: (user, plain) => verifyCredentials(config.users, user, plain),
  });
  if (result.kind === "blocked") {
    const minutes = Math.max(1, Math.ceil(result.retryAfterMs / 60_000));
    return redirect(`/login?error=bloqueado&min=${minutes}`, 303);
  }
  if (result.kind === "invalid") return redirect("/login?error=credenciales", 303);

  // Siempre un id nuevo (contra fijación de sesión); se destruye la anterior si la había.
  const previous = cookies.get(SESSION_COOKIE)?.value;
  const previousId = previous ? unsign(previous, config.sessionSecret) : null;
  if (previousId) sessions.destroy(previousId);
  const { id } = sessions.create(username);
  cookies.set(SESSION_COOKIE, sign(id, config.sessionSecret), SESSION_COOKIE_OPTIONS);
  cookies.delete(LOGIN_CSRF_COOKIE, DELETE_COOKIE_OPTIONS);
  return redirect("/", 303);
};

export const ALL: APIRoute = () =>
  new Response(LABELS.errors.methodNotAllowed, { status: 405, headers: { Allow: "POST" } });
