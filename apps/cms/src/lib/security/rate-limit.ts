/** Tope duro de claves en memoria. */
export const MAX_ENTRIES = 10_000;

export interface RateLimiterOptions {
  now: () => number;
  maxFailures: number;
  windowMs: number;
  lockMs: number;
}

export interface RateLimitStatus {
  locked: boolean;
  retryAfterMs: number;
}

export interface RateLimiter {
  registerFailure(key: string): void;
  check(key: string): RateLimitStatus;
  reset(key: string): void;
}

interface Entry {
  failures: number[];
  lockedUntil: number;
}

/** Límite de fallos con ventana deslizante y bloqueo temporal. Claves: "u:<usuario>", "ip:<ip>". */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { now, maxFailures, windowMs, lockMs } = options;
  const entries = new Map<string, Entry>();
  let lastSweep = now();

  const prune = (entry: Entry, at: number) => {
    entry.failures = entry.failures.filter((time) => at - time < windowMs);
  };

  // Limpieza periódica para que el mapa no crezca sin límite.
  const sweep = (at: number) => {
    if (at - lastSweep < windowMs) return;
    lastSweep = at;
    for (const [key, entry] of entries) {
      prune(entry, at);
      if (entry.failures.length === 0 && entry.lockedUntil <= at) entries.delete(key);
    }
  };

  // Cierre ante ataque: solo se descarta una entrada que no esté bloqueada y no tenga fallos
  // dentro de la ventana. Si el mapa está lleno y no hay nada descartable, devuelve false:
  // una clave nueva se trata como bloqueada (check) y no se inserta (registerFailure).
  // Así un atacante que inunde claves nuevas no puede expulsar bloqueos ni fallos reales.
  const makeRoom = (at: number): boolean => {
    if (entries.size < MAX_ENTRIES) return true;
    for (const [key, entry] of entries) {
      prune(entry, at);
      if (entry.failures.length === 0 && entry.lockedUntil <= at) {
        entries.delete(key);
        return true;
      }
    }
    return false;
  };

  return {
    registerFailure(key) {
      const at = now();
      sweep(at);
      const existing = entries.get(key);
      if (!existing && !makeRoom(at)) return;
      const entry = existing ?? { failures: [], lockedUntil: 0 };
      prune(entry, at);
      entry.failures.push(at);
      if (entry.failures.length >= maxFailures) {
        entry.lockedUntil = at + lockMs;
        entry.failures = [];
      }
      entries.delete(key);
      entries.set(key, entry);
    },
    check(key) {
      const at = now();
      const entry = entries.get(key);
      if (!entry) {
        sweep(at);
        if (!makeRoom(at)) return { locked: true, retryAfterMs: lockMs };
        return { locked: false, retryAfterMs: 0 };
      }
      if (entry.lockedUntil <= at) return { locked: false, retryAfterMs: 0 };
      return { locked: true, retryAfterMs: entry.lockedUntil - at };
    },
    reset(key) {
      entries.delete(key);
    },
  };
}
