import { createHmac, timingSafeEqual } from "node:crypto";

function mac(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

/** Devuelve `value.<firma>`. */
export function sign(value: string, secret: string): string {
  return `${value}.${mac(value, secret)}`;
}

/** Devuelve el valor original o null si la firma no es válida. La firma es el último segmento. */
export function unsign(signed: string, secret: string): string | null {
  const dot = signed.lastIndexOf(".");
  if (dot < 0) return null;
  const value = signed.slice(0, dot);
  const given = Buffer.from(signed.slice(dot + 1));
  const expected = Buffer.from(mac(value, secret));
  if (given.length !== expected.length) return null;
  return timingSafeEqual(given, expected) ? value : null;
}
