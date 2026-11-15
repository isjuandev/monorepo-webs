import assert from "node:assert/strict";
import { test } from "node:test";
import { attemptLogin } from "../src/lib/security/login-attempt.ts";
import { createRateLimiter, type RateLimiter } from "../src/lib/security/rate-limit.ts";

const MIN = 60_000;

function limiter(maxFailures: number): RateLimiter {
  return createRateLimiter({ now: () => 0, maxFailures, windowMs: 15 * MIN, lockMs: 15 * MIN });
}

function spy(inner: RateLimiter): { limiter: RateLimiter; keys: string[] } {
  const keys: string[] = [];
  return {
    keys,
    limiter: {
      check: (key) => inner.check(key),
      reset: (key) => inner.reset(key),
      registerFailure(key) {
        keys.push(key);
        inner.registerFailure(key);
      },
    },
  };
}

test("40 intentos simultáneos: como mucho 5 llegan a verificar", async () => {
  const userLimiter = limiter(5);
  const ipLimiter = limiter(20);
  let verified = 0;
  const verify = async (_u: string, plain: string) => {
    verified += 1;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return plain === "correcta";
  };
  const results = await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      attemptLogin({
        username: "ana-perez",
        // La contraseña correcta va al final: no debe poder entrar tras 5 reservas.
        password: i === 39 ? "correcta" : "mala",
        ipKey: "ip:1.1.1.1",
        userExists: true,
        userLimiter,
        ipLimiter,
        verify,
      })
    )
  );
  assert.ok(verified <= 5, `verificados: ${verified}`);
  assert.equal(results.filter((r) => r.kind === "ok").length, 0);
  assert.equal(results[39]?.kind, "blocked");
});

test("la IP también se reserva: 40 usuarios distintos, como mucho 20 verifican", async () => {
  const userLimiter = limiter(5);
  const ipLimiter = limiter(20);
  let verified = 0;
  await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      attemptLogin({
        username: `inventado-${i}`,
        password: "x",
        ipKey: "ip:2.2.2.2",
        userExists: false,
        userLimiter,
        ipLimiter,
        verify: async () => {
          verified += 1;
          await new Promise((resolve) => setTimeout(resolve, 5));
          return false;
        },
      })
    )
  );
  assert.ok(verified <= 20, `verificados: ${verified}`);
});

test("usuarios inexistentes no registran la clave u:", async () => {
  const user = spy(limiter(5));
  const ip = spy(limiter(20));
  const base = {
    password: "x",
    ipKey: "ip:3.3.3.3",
    userLimiter: user.limiter,
    ipLimiter: ip.limiter,
    verify: async () => false,
  };
  const fake = await attemptLogin({ ...base, username: "fantasma", userExists: false });
  assert.equal(fake.kind, "invalid");
  assert.deepEqual(user.keys, []);
  assert.deepEqual(ip.keys, ["ip:3.3.3.3"]);
  await attemptLogin({ ...base, username: "luis", userExists: true });
  assert.deepEqual(user.keys, ["u:luis"]);
});

test("éxito: resetea u: y devuelve ok; los fallos previos no bloquean", async () => {
  const userLimiter = limiter(5);
  const ipLimiter = limiter(20);
  const base = {
    username: "luis",
    ipKey: "ip:4.4.4.4",
    userExists: true,
    userLimiter,
    ipLimiter,
  };
  for (let i = 0; i < 4; i += 1) {
    const r = await attemptLogin({ ...base, password: "mala", verify: async () => false });
    assert.equal(r.kind, "invalid");
  }
  const ok = await attemptLogin({ ...base, password: "buena", verify: async () => true });
  assert.equal(ok.kind, "ok");
  assert.equal(userLimiter.check("u:luis").locked, false);
  // tras el reset hay cupo completo otra vez
  for (let i = 0; i < 4; i += 1) {
    await attemptLogin({ ...base, password: "mala", verify: async () => false });
  }
  assert.equal(userLimiter.check("u:luis").locked, false);
});

test("el 5.º fallo responde bloqueado y no se vuelve a verificar", async () => {
  const userLimiter = limiter(5);
  const ipLimiter = limiter(20);
  let verified = 0;
  const run = () =>
    attemptLogin({
      username: "luis",
      password: "mala",
      ipKey: "ip:5.5.5.5",
      userExists: true,
      userLimiter,
      ipLimiter,
      verify: async () => {
        verified += 1;
        return false;
      },
    });
  const kinds: string[] = [];
  for (let i = 0; i < 7; i += 1) kinds.push((await run()).kind);
  assert.deepEqual(kinds, [
    "invalid",
    "invalid",
    "invalid",
    "invalid",
    "blocked",
    "blocked",
    "blocked",
  ]);
  assert.equal(verified, 5);
});
