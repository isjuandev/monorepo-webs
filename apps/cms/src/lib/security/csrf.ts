import { randomBytes, timingSafeEqual } from "node:crypto";
import { sign, unsign } from "./signing.ts";

export const LOGIN_CSRF_MAX_AGE_MS = 60 * 60 * 1000;
const LOGIN_CSRF_PURPOSE = "login-csrf";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Compara el token de la sesión con el enviado en la petición. */
export function verifySessionCsrf(session: { csrfToken: string }, provided: string): boolean {
  return safeEqual(session.csrfToken, provided);
}

/** Double-submit firmado para el login (aún sin sesión). La cookie lleva propósito y hora. */
export function issueLoginCsrf(
  secret: string,
  now: () => number = Date.now
): { cookieValue: string; formToken: string } {
  const formToken = randomBytes(32).toString("base64url");
  const payload = `${LOGIN_CSRF_PURPOSE}:${formToken}:${now()}`;
  return { cookieValue: sign(payload, secret), formToken };
}

export function verifyLoginCsrf(
  cookieValue: string,
  formToken: string,
  secret: string,
  now: () => number = Date.now
): boolean {
  const payload = unsign(cookieValue, secret);
  if (payload === null) return false;
  const [purpose, token, issuedAt, ...rest] = payload.split(":");
  if (purpose !== LOGIN_CSRF_PURPOSE || !token || rest.length > 0) return false;
  if (issuedAt === undefined || !/^\d+$/.test(issuedAt)) return false;
  const issued = Number(issuedAt);
  if (!Number.isFinite(issued)) return false;
  const age = now() - issued;
  if (age < 0 || age > LOGIN_CSRF_MAX_AGE_MS) return false;
  return safeEqual(token, formToken);
}

/** Margen mínimo de vida para reutilizar la cookie CSRF del login existente. */
export const LOGIN_CSRF_REUSE_MIN_MS = 10 * 60 * 1000;

/**
 * Si la cookie CSRF del login es válida y le queda margen, devuelve el token de formulario
 * derivado de ella (así varias pestañas o recargas no se pisan); si no, null.
 */
export function reuseLoginCsrf(
  cookieValue: string,
  secret: string,
  now: () => number = Date.now
): string | null {
  const payload = unsign(cookieValue, secret);
  if (payload === null) return null;
  const [purpose, token, issuedAt, ...rest] = payload.split(":");
  if (purpose !== LOGIN_CSRF_PURPOSE || !token || rest.length > 0) return null;
  if (issuedAt === undefined || !/^\d+$/.test(issuedAt)) return null;
  const remaining = LOGIN_CSRF_MAX_AGE_MS - (now() - Number(issuedAt));
  if (remaining < LOGIN_CSRF_REUSE_MIN_MS || remaining > LOGIN_CSRF_MAX_AGE_MS) return null;
  return token;
}
