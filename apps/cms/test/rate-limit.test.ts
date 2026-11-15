import assert from "node:assert/strict";
import { test } from "node:test";
import { createRateLimiter, MAX_ENTRIES } from "../src/lib/security/rate-limit.ts";

const MIN = 60_000;

function setup() {
  let time = 0;
  const limiter = createRateLimiter({
    now: () => time,
    maxFailures: 5,
    windowMs: 15 * MIN,
    lockMs: 15 * MIN,
  });
  return {
    limiter,
    advance: (ms: number) => {
      time += ms;
    },
  };
}

test("bloquea al llegar al máximo y desbloquea tras lockMs", () => {
  const { limiter, advance } = setup();
  for (let i = 0; i < 4; i += 1) limiter.registerFailure("u:ana");
  assert.equal(limiter.check("u:ana").locked, false);
  limiter.registerFailure("u:ana");
  const status = limiter.check("u:ana");
  assert.equal(status.locked, true);
  assert.equal(status.retryAfterMs, 15 * MIN);
  assert.equal(limiter.check("u:luis").locked, false);
  advance(10 * MIN);
  assert.equal(limiter.check("u:ana").retryAfterMs, 5 * MIN);
  advance(5 * MIN);
  assert.equal(limiter.check("u:ana").locked, false);
});

test("ventana deslizante: fallos viejos no cuentan", () => {
  const { limiter, advance } = setup();
  for (let i = 0; i < 4; i += 1) limiter.registerFailure("ip:1.1.1.1");
  advance(16 * MIN);
  limiter.registerFailure("ip:1.1.1.1");
  assert.equal(limiter.check("ip:1.1.1.1").locked, false);
});

test("tope duro: con el mapa lleno de fallos recientes no se expulsa nada", () => {
  const { limiter } = setup();
  for (let i = 0; i < 5; i += 1) limiter.registerFailure("u:bloqueado");
  limiter.registerFailure("ip:con-fallo");
  for (let i = 0; i < MAX_ENTRIES; i += 1) limiter.registerFailure(`ip:${i}`);
  // Los bloqueos y los fallos dentro de la ventana siguen ahí.
  assert.equal(limiter.check("u:bloqueado").locked, true);
  // Una clave nueva se trata como bloqueada y no se inserta.
  assert.equal(limiter.check("ip:nueva").locked, true);
  for (let i = 0; i < 30; i += 1) limiter.registerFailure("ip:nueva");
  assert.equal(limiter.check("ip:con-fallo").locked, false);
  for (let i = 0; i < 4; i += 1) limiter.registerFailure("ip:con-fallo");
  assert.equal(limiter.check("ip:con-fallo").locked, true);
});

test("tope duro: se libera sitio cuando hay entradas caducadas", () => {
  const { limiter, advance } = setup();
  for (let i = 0; i < MAX_ENTRIES; i += 1) limiter.registerFailure(`ip:${i}`);
  assert.equal(limiter.check("ip:nueva").locked, true);
  advance(16 * MIN);
  assert.equal(limiter.check("ip:nueva").locked, false);
  for (let i = 0; i < 5; i += 1) limiter.registerFailure("ip:nueva");
  assert.equal(limiter.check("ip:nueva").locked, true);
});

test("reset borra el estado", () => {
  const { limiter } = setup();
  for (let i = 0; i < 5; i += 1) limiter.registerFailure("u:ana");
  assert.equal(limiter.check("u:ana").locked, true);
  limiter.reset("u:ana");
  assert.equal(limiter.check("u:ana").locked, false);
});

test("la limpieza no rompe el estado de claves activas", () => {
  const { limiter, advance } = setup();
  limiter.registerFailure("u:viejo");
  advance(20 * MIN);
  limiter.registerFailure("u:nuevo");
  assert.equal(limiter.check("u:viejo").locked, false);
  for (let i = 0; i < 4; i += 1) limiter.registerFailure("u:nuevo");
  assert.equal(limiter.check("u:nuevo").locked, true);
});
