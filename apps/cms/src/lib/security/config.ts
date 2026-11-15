import { existsSync, statSync } from "node:fs";
import { isAbsolute } from "node:path";
import { KEBAB_CASE_REGEX } from "@repo/cms-core/markdown";
import { isValidPasswordHash } from "./passwords.ts";

export const SESSION_IDLE_MS = 30 * 60 * 1000;
export const SESSION_MAX_MS = 8 * 60 * 60 * 1000;
export const USER_MAX_FAILURES = 5;
export const USER_FAILURE_WINDOW_MS = 15 * 60 * 1000;
export const USER_LOCK_MS = 15 * 60 * 1000;
export const IP_MAX_FAILURES = 20;
export const IP_FAILURE_WINDOW_MS = 15 * 60 * 1000;
export const IP_LOCK_MS = 15 * 60 * 1000;
export const MIN_SESSION_SECRET_LENGTH = 32;
export const MAX_USERS = 2;

export interface CmsConfig {
  sessionSecret: string;
  /** usuario → hash scrypt */
  users: ReadonlyMap<string, string>;
  repoDir: string;
  trustProxy: boolean;
}

function parseUser(name: string, raw: string, errors: string[]): [string, string] | null {
  const sep = raw.indexOf(":");
  if (sep < 0) {
    errors.push(`${name} debe tener el formato <usuario>:<hash>.`);
    return null;
  }
  const username = raw.slice(0, sep);
  const hash = raw.slice(sep + 1);
  let ok = true;
  if (!KEBAB_CASE_REGEX.test(username)) {
    errors.push(`${name}: el usuario debe estar en kebab-case.`);
    ok = false;
  }
  if (!isValidPasswordHash(hash)) {
    errors.push(`${name}: el hash no tiene el formato scrypt esperado.`);
    ok = false;
  }
  return ok ? [username, hash] : null;
}

/** Valida el entorno. Lista todos los problemas y nunca incluye valores secretos en el mensaje. */
export function loadConfig(env: Record<string, string | undefined>): CmsConfig {
  const errors: string[] = [];

  // Se recorta el espacio y los saltos de línea que suelen arrastrarse al pegar en Coolify.
  const sessionSecret = (env.CMS_SESSION_SECRET ?? "").trim();
  if (sessionSecret.length < MIN_SESSION_SECRET_LENGTH) {
    errors.push(
      `CMS_SESSION_SECRET es obligatoria y debe tener al menos ${MIN_SESSION_SECRET_LENGTH} caracteres.`
    );
  }

  const users = new Map<string, string>();
  if (!(env.CMS_USER_1 ?? "").trim()) errors.push("CMS_USER_1 es obligatoria.");
  const extra = Object.keys(env).filter((key) => {
    const match = /^CMS_USER_(\d+)$/.exec(key);
    return match !== null && Number(match[1]) > MAX_USERS && (env[key] ?? "").trim() !== "";
  });
  if (extra.length > 0) errors.push(`Se admiten como máximo ${MAX_USERS} usuarios.`);
  for (const name of ["CMS_USER_1", "CMS_USER_2"]) {
    const raw = (env[name] ?? "").trim();
    if (!raw) continue;
    const parsed = parseUser(name, raw, errors);
    if (!parsed) continue;
    if (users.has(parsed[0])) errors.push(`${name}: el usuario está repetido.`);
    else users.set(parsed[0], parsed[1]);
  }

  const repoDir = (env.CMS_REPO_DIR ?? "").trim();
  if (!repoDir) {
    errors.push("CMS_REPO_DIR es obligatoria.");
  } else if (!isAbsolute(repoDir)) {
    errors.push("CMS_REPO_DIR debe ser una ruta absoluta.");
  } else if (!existsSync(repoDir) || !statSync(repoDir).isDirectory()) {
    errors.push("CMS_REPO_DIR no existe o no es un directorio.");
  }

  const trust = (env.CMS_TRUST_PROXY ?? "0").trim();
  if (trust !== "0" && trust !== "1") errors.push('CMS_TRUST_PROXY debe ser "1" o "0".');

  if (errors.length > 0) {
    throw new Error(`Configuración del CMS inválida:\n- ${errors.join("\n- ")}`);
  }
  return { sessionSecret, users, repoDir, trustProxy: trust === "1" };
}
