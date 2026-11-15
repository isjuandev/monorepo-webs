import type { RateLimiter } from "./rate-limit.ts";

export interface LoginAttemptInput {
  username: string;
  password: string;
  /** Clave del limitador por IP, p. ej. "ip:1.2.3.4". */
  ipKey: string;
  /** El usuario existe en la configuración (solo entonces se usa el límite "u:"). */
  userExists: boolean;
  userLimiter: RateLimiter;
  ipLimiter: RateLimiter;
  verify: (username: string, password: string) => Promise<boolean>;
}

export type LoginAttemptResult =
  | { kind: "ok" }
  | { kind: "invalid" }
  | { kind: "blocked"; retryAfterMs: number };

function lockStatus(input: LoginAttemptInput): number | null {
  const ip = input.ipLimiter.check(input.ipKey);
  const user = input.userExists
    ? input.userLimiter.check(`u:${input.username}`)
    : { locked: false, retryAfterMs: 0 };
  if (!ip.locked && !user.locked) return null;
  return Math.max(ip.retryAfterMs, user.retryAfterMs);
}

/**
 * Intento de login con el intento RESERVADO de forma síncrona antes de verificar la contraseña.
 * Sin esa reserva, N peticiones simultáneas pasarían todas el check antes de que ninguna
 * registrase su fallo (TOCTOU). Con ella, como mucho `maxFailures` intentos llegan a `verify`.
 *
 * - Se registra el intento en "ip:" y, solo si el usuario existe, en "u:" (los nombres
 *   inventados no llenan el limitador).
 * - Si sale bien se hace reset de "u:". El registro de "ip:" se deja (no se deshace): es más
 *   estricto y un acceso legítimo cuenta poco frente al tope de 20 por ventana.
 * - Si tras la verificación el límite ya está alcanzado, se responde "bloqueado".
 */
export async function attemptLogin(input: LoginAttemptInput): Promise<LoginAttemptResult> {
  const userKey = `u:${input.username}`;
  const before = lockStatus(input);
  if (before !== null) return { kind: "blocked", retryAfterMs: before };

  // Reserva síncrona: nada entre el check y el registro cede el control del bucle de eventos.
  input.ipLimiter.registerFailure(input.ipKey);
  if (input.userExists) input.userLimiter.registerFailure(userKey);

  const valid = await input.verify(input.username, input.password);
  if (valid) {
    if (input.userExists) input.userLimiter.reset(userKey);
    return { kind: "ok" };
  }
  const after = lockStatus(input);
  if (after !== null) return { kind: "blocked", retryAfterMs: after };
  return { kind: "invalid" };
}
