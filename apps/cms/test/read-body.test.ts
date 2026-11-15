import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BodyTooLargeError,
  declaredLength,
  exceedsDeclared,
  readBodyLimited,
} from "../src/lib/http/read-body.ts";

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

function post(body: ReadableStream<Uint8Array> | string, headers: Record<string, string> = {}) {
  return new Request("http://x/", { method: "POST", body, headers, duplex: "half" } as RequestInit);
}

test("lee un cuerpo pequeño", async () => {
  assert.equal(await readBodyLimited(post("a=1&b=2"), 100), "a=1&b=2");
  assert.equal(await readBodyLimited(post(streamOf(["a=", "1"])), 100), "a=1");
  assert.equal(await readBodyLimited(new Request("http://x/"), 100), "");
});

test("rechaza por Content-Length sin leer", async () => {
  const request = post("x", { "content-length": "999999" });
  await assert.rejects(readBodyLimited(request, 100), BodyTooLargeError);
});

test("corta en streaming sin Content-Length (chunked)", async () => {
  let pulled = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulled += 1;
      controller.enqueue(new Uint8Array(40));
      if (pulled > 1000) controller.close();
    },
  });
  await assert.rejects(readBodyLimited(post(body), 100), BodyTooLargeError);
  assert.ok(pulled < 10, `lecturas: ${pulled}`);
});

test("tope exacto permitido", async () => {
  assert.equal((await readBodyLimited(post("a".repeat(100)), 100)).length, 100);
  await assert.rejects(readBodyLimited(post("a".repeat(101)), 100), BodyTooLargeError);
});

test("declaredLength y exceedsDeclared", () => {
  assert.equal(declaredLength(new Headers({ "content-length": "12" })), 12);
  assert.equal(declaredLength(new Headers({ "content-length": "-1" })), null);
  assert.equal(declaredLength(new Headers({ "content-length": "abc" })), null);
  assert.equal(declaredLength(new Headers()), null);
  assert.equal(exceedsDeclared(new Headers({ "content-length": "101" }), 100), true);
  assert.equal(exceedsDeclared(new Headers({ "content-length": "100" }), 100), false);
  assert.equal(exceedsDeclared(new Headers(), 100), false);
});
