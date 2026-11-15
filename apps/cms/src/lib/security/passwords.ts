import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/** Parámetros de scrypt. Las pruebas pueden reducirlos; los valores por defecto no se debilitan. */
export interface ScryptParams {
  N: number;
  r: number;
  p: number;
}

export const SCRYPT_DEFAULTS: ScryptParams = { N: 2 ** 15, r: 8, p: 1 };
export const MIN_PASSWORD_LENGTH = 16;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
// Límites al leer un hash almacenado: evitan que un hash manipulado dispare un DoS.
const MAX_N = 2 ** 20;
const MAX_R = 16;
const MAX_P = 4;
// Cota única de memoria: lo que isValidPasswordHash acepta, verifyPassword lo puede calcular.
const MAX_MEM_READ = 256 * 1024 * 1024;
const MEM_MARGIN = 1024 * 1024;

/** Formato: scrypt$<N>$<r>$<p>$<salt b64url>$<hash b64url>. */
export const PASSWORD_HASH_REGEX = /^scrypt\$\d+\$\d+\$\d+\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/;

/** Memoria que necesita scrypt (128·r·(N+p)) más un margen. */
function memoryFor(params: ScryptParams): number {
  return 128 * params.r * (params.N + params.p) + MEM_MARGIN;
}

/**
 * Normalización NFC (RFC 8265, OpaqueString): conserva la diferencia entre caracteres
 * de compatibilidad. El mínimo de 16 se mide en puntos de código tras normalizar.
 */
function normalizePassword(plain: string): string {
  return plain.normalize("NFC");
}

function derive(plain: string, salt: Buffer, params: ScryptParams, keylen: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      normalizePassword(plain),
      salt,
      keylen,
      { N: params.N, r: params.r, p: params.p, maxmem: memoryFor(params) },
      (error, key) => (error ? reject(error) : resolve(key))
    );
  });
}

export async function hashPassword(
  plain: string,
  params: ScryptParams = SCRYPT_DEFAULTS
): Promise<string> {
  if ([...normalizePassword(plain)].length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(plain, salt, params, KEY_LENGTH);
  return [
    "scrypt",
    params.N,
    params.r,
    params.p,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

interface ParsedHash {
  params: ScryptParams;
  salt: Buffer;
  key: Buffer;
}

function parseHash(stored: string): ParsedHash | null {
  if (!PASSWORD_HASH_REGEX.test(stored)) return null;
  const [, n, r, p, salt, key] = stored.split("$");
  const params = { N: Number(n), r: Number(r), p: Number(p) };
  const saltBuf = Buffer.from(salt ?? "", "base64url");
  const keyBuf = Buffer.from(key ?? "", "base64url");
  const validN = Number.isInteger(params.N) && params.N >= 2 && params.N <= MAX_N;
  if (!validN || (params.N & (params.N - 1)) !== 0) return null;
  if (!Number.isInteger(params.r) || params.r < 1 || params.r > MAX_R) return null;
  if (!Number.isInteger(params.p) || params.p < 1 || params.p > MAX_P) return null;
  if (memoryFor(params) > MAX_MEM_READ) return null;
  // OpenSSL exige N < 2^(16·r); sin esta regla, un hash aceptado fallaría al verificar.
  if (params.N >= 2 ** (16 * params.r)) return null;
  if (saltBuf.length < 8 || saltBuf.length > 64) return null;
  if (keyBuf.length < 16 || keyBuf.length > 128) return null;
  return { params, salt: saltBuf, key: keyBuf };
}

export function isValidPasswordHash(stored: string): boolean {
  return parseHash(stored) !== null;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parsed = parseHash(stored);
  if (!parsed) return false;
  try {
    const key = await derive(plain, parsed.salt, parsed.params, parsed.key.length);
    return timingSafeEqual(key, parsed.key);
  } catch {
    return false;
  }
}

/**
 * Hash ficticio constante (SCRYPT_DEFAULTS, contraseña aleatoria desechada). No es un secreto:
 * solo iguala tiempos cuando el usuario no existe.
 */
export const DUMMY_HASH =
  "scrypt$32768$8$1$t0CbVdoRhp1CevyqYgn78w$S9KXvBnznzqa5pr2H5QoW781lT08Gm2YXEKqo374rcgewHNi3fcFa0Y8hLsccSJFTqdgcaVSsWLBxbNOzRJFKQ";

/** `users` mapea usuario → hash. Un usuario inexistente consume el mismo tiempo y devuelve false. */
export async function verifyCredentials(
  users: ReadonlyMap<string, string>,
  username: string,
  plain: string
): Promise<boolean> {
  const stored = users.get(username);
  if (stored === undefined) {
    await verifyPassword(plain, DUMMY_HASH);
    return false;
  }
  return verifyPassword(plain, stored);
}
