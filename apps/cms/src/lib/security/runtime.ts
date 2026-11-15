import {
  type CmsConfig,
  IP_FAILURE_WINDOW_MS,
  IP_LOCK_MS,
  IP_MAX_FAILURES,
  loadConfig,
  SESSION_IDLE_MS,
  SESSION_MAX_MS,
  USER_FAILURE_WINDOW_MS,
  USER_LOCK_MS,
  USER_MAX_FAILURES,
} from "./config.ts";
import { createRateLimiter, type RateLimiter } from "./rate-limit.ts";
import { createSessionStore, type SessionStore } from "./sessions.ts";

export interface SecurityRuntime {
  config: CmsConfig;
  sessions: SessionStore;
  /** Claves "u:<usuario>". */
  userLimiter: RateLimiter;
  /** Claves "ip:<ip>". */
  ipLimiter: RateLimiter;
}

export type RuntimeState = { ok: true; runtime: SecurityRuntime } | { ok: false };

function init(): RuntimeState {
  let config: CmsConfig;
  try {
    config = loadConfig(process.env);
  } catch (error) {
    // El mensaje de loadConfig no incluye valores secretos.
    console.error(error instanceof Error ? error.message : "Configuración del CMS inválida.");
    return { ok: false };
  }
  const now = () => Date.now();
  const sessions = createSessionStore({ now, idleMs: SESSION_IDLE_MS, maxMs: SESSION_MAX_MS });
  setInterval(() => sessions.purgeExpired(), 5 * 60 * 1000).unref();
  return {
    ok: true,
    runtime: {
      config,
      sessions,
      userLimiter: createRateLimiter({
        now,
        maxFailures: USER_MAX_FAILURES,
        windowMs: USER_FAILURE_WINDOW_MS,
        lockMs: USER_LOCK_MS,
      }),
      ipLimiter: createRateLimiter({
        now,
        maxFailures: IP_MAX_FAILURES,
        windowMs: IP_FAILURE_WINDOW_MS,
        lockMs: IP_LOCK_MS,
      }),
    },
  };
}

let state: RuntimeState | null = null;

/** Singleton: la configuración se carga una sola vez por proceso. */
export function getRuntime(): RuntimeState {
  state ??= init();
  return state;
}
