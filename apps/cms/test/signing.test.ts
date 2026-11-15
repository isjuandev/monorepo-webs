import assert from "node:assert/strict";
import { test } from "node:test";
import { sign, unsign } from "../src/lib/security/signing.ts";

const SECRET = "secreto-de-prueba-con-longitud-suficiente";

test("ida y vuelta, también con puntos internos", () => {
  assert.equal(unsign(sign("abc", SECRET), SECRET), "abc");
  assert.equal(unsign(sign("a.b.c", SECRET), SECRET), "a.b.c");
  assert.equal(unsign(sign("", SECRET), SECRET), "");
});

test("firma alterada", () => {
  const signed = sign("abc", SECRET);
  assert.equal(unsign(`${signed.slice(0, -1)}${signed.endsWith("A") ? "B" : "A"}`, SECRET), null);
  assert.equal(unsign(`${signed}x`, SECRET), null);
  assert.equal(unsign("abc", SECRET), null);
});

test("valor alterado", () => {
  const signed = sign("abc", SECRET);
  assert.equal(unsign(signed.replace("abc", "abd"), SECRET), null);
});

test("secreto distinto", () => {
  assert.equal(unsign(sign("abc", SECRET), `${SECRET}-otro`), null);
});
