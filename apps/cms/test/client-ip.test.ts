import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveClientIp, UNKNOWN_IP } from "../src/lib/http/client-ip.ts";

const h = (value?: string) => new Headers(value === undefined ? {} : { "x-forwarded-for": value });

test("sin proxy de confianza ignora X-Forwarded-For", () => {
  assert.equal(resolveClientIp("10.0.0.5", h("1.2.3.4"), false), "10.0.0.5");
});

test("con proxy toma el valor más a la derecha", () => {
  assert.equal(resolveClientIp("10.0.0.5", h("6.6.6.6, 1.2.3.4"), true), "1.2.3.4");
  assert.equal(resolveClientIp("10.0.0.5", h("1.2.3.4"), true), "1.2.3.4");
  assert.equal(resolveClientIp("10.0.0.5", h("6.6.6.6,  7.7.7.7 "), true), "7.7.7.7");
});

test("con proxy y cabecera vacía o ausente usa clientAddress", () => {
  assert.equal(resolveClientIp("10.0.0.5", h(), true), "10.0.0.5");
  assert.equal(resolveClientIp("10.0.0.5", h(""), true), "10.0.0.5");
  assert.equal(resolveClientIp("10.0.0.5", h("1.2.3.4, "), true), "10.0.0.5");
});

test("nunca devuelve vacío", () => {
  assert.equal(resolveClientIp(undefined, h(), false), UNKNOWN_IP);
  assert.equal(resolveClientIp("", h(), true), UNKNOWN_IP);
  assert.equal(resolveClientIp("  ", h(" "), true), UNKNOWN_IP);
});
