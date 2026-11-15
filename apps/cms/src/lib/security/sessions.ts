import { randomBytes } from "node:crypto";

export interface Session {
  id: string;
  username: string;
  csrfToken: string;
  createdAt: number;
  lastSeen: number;
}

export interface SessionStoreOptions {
  now: () => number;
  idleMs: number;
  maxMs: number;
}

export interface SessionStore {
  create(username: string): { id: string; csrfToken: string };
  get(id: string): Readonly<Session> | null;
  destroy(id: string): void;
  destroyAllFor(username: string): void;
  purgeExpired(): number;
}

/**
 * Sesiones en memoria. Un reinicio del proceso cierra todas las sesiones; se acepta
 * porque son solo 2 usuarios y evita guardar estado de sesión en disco.
 */
export function createSessionStore(options: SessionStoreOptions): SessionStore {
  const { now, idleMs, maxMs } = options;
  const sessions = new Map<string, Session>();

  const isExpired = (session: Session, at: number): boolean =>
    at - session.lastSeen > idleMs || at - session.createdAt > maxMs;

  return {
    create(username) {
      const at = now();
      const id = randomBytes(32).toString("base64url");
      const csrfToken = randomBytes(32).toString("base64url");
      sessions.set(id, { id, username, csrfToken, createdAt: at, lastSeen: at });
      return { id, csrfToken };
    },
    get(id) {
      const session = sessions.get(id);
      if (!session) return null;
      const at = now();
      if (isExpired(session, at)) {
        sessions.delete(id);
        return null;
      }
      session.lastSeen = at;
      return { ...session };
    },
    destroy(id) {
      sessions.delete(id);
    },
    destroyAllFor(username) {
      for (const [id, session] of sessions) {
        if (session.username === username) sessions.delete(id);
      }
    },
    purgeExpired() {
      const at = now();
      let removed = 0;
      for (const [id, session] of sessions) {
        if (isExpired(session, at)) {
          sessions.delete(id);
          removed += 1;
        }
      }
      return removed;
    },
  };
}
