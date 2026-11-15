import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DUMMY_HASH,
  hashPassword,
  isValidPasswordHash,
  SCRYPT_DEFAULTS,
  verifyCredentials,
  verifyPassword,
} from "../src/lib/security/passwords.ts";

// Parámetros reducidos SOLO en pruebas, para que scrypt sea rápido.
const FAST = { N: 2 ** 10, r: 8, p: 1 };
const PLAIN = "una-contrasena-muy-larga-1";

test("ida y vuelta y formato", async () => {
  const hash = await hashPassword(PLAIN, FAST);
  assert.match(hash, /^scrypt\$1024\$8\$1\$[\w-]+\$[\w-]+$/);
  assert.equal(await verifyPassword(PLAIN, hash), true);
});

test("el hash por defecto usa N=2^15", async () => {
  const hash = await hashPassword(PLAIN);
  assert.ok(hash.startsWith("scrypt$32768$8$1$"));
  assert.equal(await verifyPassword(PLAIN, hash), true);
});

test("contraseña incorrecta y sales distintas", async () => {
  const hash = await hashPassword(PLAIN, FAST);
  assert.equal(await verifyPassword("otra-contrasena-larga-2", hash), false);
  assert.notEqual(hash, await hashPassword(PLAIN, FAST));
});

test("contraseña corta rechazada", async () => {
  await assert.rejects(hashPassword("corta", FAST), /al menos 16/);
});

test("hash manipulado", async () => {
  const hash = await hashPassword(PLAIN, FAST);
  const parts = hash.split("$");
  const hugeN = [parts[0], String(2 ** 30), ...parts.slice(2)].join("$");
  assert.equal(await verifyPassword(PLAIN, hugeN), false);
  const hugeR = [parts[0], parts[1], "9999", ...parts.slice(3)].join("$");
  assert.equal(await verifyPassword(PLAIN, hugeR), false);
  const notPow2 = [parts[0], "1000", ...parts.slice(2)].join("$");
  assert.equal(await verifyPassword(PLAIN, notPow2), false);
  assert.equal(await verifyPassword(PLAIN, "basura"), false);
  assert.equal(await verifyPassword(PLAIN, "scrypt$1$2"), false);
  assert.equal(await verifyPassword(PLAIN, ""), false);
});

test("verifyCredentials", async () => {
  const users = new Map([["ana", await hashPassword(PLAIN, FAST)]]);
  assert.equal(await verifyCredentials(users, "ana", PLAIN), true);
  assert.equal(await verifyCredentials(users, "ana", "incorrecta-incorrecta"), false);
  assert.equal(await verifyCredentials(users, "nadie", PLAIN), false);
});

test("hash con N=2^16 (antes fallaba por memoria) verifica", async () => {
  const hash = await hashPassword(PLAIN, { N: 2 ** 16, r: 8, p: 1 });
  assert.equal(isValidPasswordHash(hash), true);
  assert.equal(await verifyPassword(PLAIN, hash), true);
  assert.equal(await verifyPassword("otra-contrasena-larga-2", hash), false);
});

test("hash por encima de la cota de memoria es inválido", () => {
  const salt = "c2FsdHNhbHRzYWx0";
  const key = "aGFzaGhhc2hoYXNoaGFzaA";
  assert.equal(isValidPasswordHash(`scrypt$${2 ** 20}$8$1$${salt}$${key}`), false);
  assert.equal(isValidPasswordHash(`scrypt$${2 ** 19}$4$1$${salt}$${key}`), false);
  // N >= 2^(16·r) lo rechaza OpenSSL al calcular, así que tampoco se acepta.
  assert.equal(isValidPasswordHash(`scrypt$${2 ** 16}$1$1$${salt}$${key}`), false);
  assert.equal(isValidPasswordHash(`scrypt$${2 ** 19}$2$1$${salt}$${key}`), true);
  assert.equal(isValidPasswordHash(`scrypt$${2 ** 15}$8$1$${salt}$${key}`), true);
});

test("el hash ficticio usa exactamente SCRYPT_DEFAULTS", () => {
  const [tag, n, r, p] = DUMMY_HASH.split("$");
  assert.equal(tag, "scrypt");
  assert.deepEqual(
    { N: Number(n), r: Number(r), p: Number(p) },
    { N: SCRYPT_DEFAULTS.N, r: SCRYPT_DEFAULTS.r, p: SCRYPT_DEFAULTS.p }
  );
  assert.equal(isValidPasswordHash(DUMMY_HASH), true);
});

test("el mínimo se mide en puntos de código tras NFC", async () => {
  const emoji = String.fromCodePoint(0x1f600);
  assert.ok(await hashPassword(emoji.repeat(16), FAST));
  await assert.rejects(hashPassword(emoji.repeat(15), FAST), /al menos 16/);
  const hash = await hashPassword("contrasené-larga-1", FAST);
  assert.equal(await verifyPassword("contrasené-larga-1", hash), true);
});
