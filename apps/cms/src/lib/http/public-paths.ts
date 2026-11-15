const PUBLIC_EXACT = new Set(["/login", "/api/sesion/iniciar", "/healthz"]);
const ASSETS_PREFIX = "/_astro/";

/** Rutas accesibles sin sesión. Todo lo demás exige sesión (falla cerrado). */
export function isPublicPath(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (PUBLIC_EXACT.has(path)) return true;
  return pathname.startsWith(ASSETS_PREFIX) && !pathname.includes("..");
}

/**
 * ¿La petición es de una página (HTML)? Solo entonces se redirige a /login; el resto
 * (favicon, imágenes, .txt, .json, Accept sin text/html) recibe 401. Sin Accept o con
 * `*` + `/*` (curl) se trata como página.
 */
export function isPageRequest(pathname: string, accept: string | null): boolean {
  const last = pathname.split("/").at(-1) ?? "";
  if (/\.[A-Za-z0-9]+$/.test(last)) return false;
  const value = (accept ?? "").trim();
  return value === "" || value === "*/*" || value.includes("text/html");
}
