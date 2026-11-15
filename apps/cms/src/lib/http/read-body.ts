// Fase 2: el tope pasará a ser por ruta (subidas de imágenes con límite propio, en streaming y solo con sesión); este global de 8 KiB quedará para formularios.
export const FORM_BODY_MAX_BYTES = 8 * 1024;

export class BodyTooLargeError extends Error {
  constructor() {
    super("Cuerpo demasiado grande.");
    this.name = "BodyTooLargeError";
  }
}

/** Content-Length declarado, o null si falta o no es un entero válido. */
export function declaredLength(headers: Pick<Headers, "get">): number | null {
  const raw = headers.get("content-length");
  if (raw === null || !/^\d+$/.test(raw.trim())) return null;
  return Number(raw.trim());
}

/** Comprobación barata previa: true si el Content-Length declarado supera el tope. */
export function exceedsDeclared(headers: Pick<Headers, "get">, maxBytes: number): boolean {
  const length = declaredLength(headers);
  return length !== null && length > maxBytes;
}

/**
 * Lee el cuerpo como texto con un tope. Rechaza por Content-Length y, si no lo hay (chunked)
 * o miente, corta la lectura en streaming en cuanto se pasa del tope. Lanza BodyTooLargeError.
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<string> {
  if (exceedsDeclared(request.headers, maxBytes)) throw new BodyTooLargeError();
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      // Sin await: en un clon (tee) la promesa de cancel no se resuelve hasta cancelar la otra rama.
      reader.cancel().catch(() => undefined);
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
