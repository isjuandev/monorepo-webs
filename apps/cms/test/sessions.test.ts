import assert from "node:assert/strict";
import { test } from "node:test";
import { createSessionStore } from "../src/lib/security/sessions.ts";

const MIN = 60_000;

function setup() {
  let time = 1_000_000;
  const store = createSessionStore({ now: () => time, idleMs: 30 * MIN, maxMs: 8 * 60 * MIN });
  return {
    store,
    advance: (ms: number) => {
      time += ms;
    },
  };
}

test("crea sesiones con ids y tokens únicos", () => {
  const { store } = setup();
  const a = store.create("ana");
  const b = store.create("ana");
  assert.notEqual(a.id, b.id);
  assert.notEqual(a.csrfToken, b.csrfToken);
  assert.equal(a.id.length, 43);
  assert.equal(store.get(a.id)?.username, "ana");
  assert.equal(store.get(a.id)?.csrfToken, a.csrfToken);
});

test("caduca por inactividad y se renueva con actividad", () => {
  const { store, advance } = setup();
  const { id } = store.create("ana");
  advance(20 * MIN);
  assert.ok(store.get(id));
  advance(20 * MIN);
  assert.ok(store.get(id));
  advance(31 * MIN);
  assert.equal(store.get(id), null);
  assert.equal(store.get(id), null);
});

test("caduca por máximo absoluto aunque haya actividad", () => {
  const { store, advance } = setup();
  const { id } = store.create("ana");
  for (let i = 0; i < 16; i += 1) {
    advance(29 * MIN);
    assert.ok(store.get(id), `iteración ${i}`);
  }
  advance(29 * MIN);
  assert.equal(store.get(id), null);
});

test("destroy y destroyAllFor", () => {
  const { store } = setup();
  const a = store.create("ana");
  const b = store.create("ana");
  const c = store.create("luis");
  store.destroy(a.id);
  assert.equal(store.get(a.id), null);
  store.destroyAllFor("ana");
  assert.equal(store.get(b.id), null);
  assert.ok(store.get(c.id));
});

test("get devuelve una copia: modificarla no afecta al almacén", () => {
  const { store } = setup();
  const { id, csrfToken } = store.create("ana");
  const copy = store.get(id) as { username: string; csrfToken: string; lastSeen: number };
  copy.username = "intruso";
  copy.csrfToken = "x";
  copy.lastSeen = 0;
  const again = store.get(id);
  assert.equal(again?.username, "ana");
  assert.equal(again?.csrfToken, csrfToken);
});

test("purgeExpired", () => {
  const { store, advance } = setup();
  const a = store.create("ana");
  advance(20 * MIN);
  const b = store.create("luis");
  advance(15 * MIN);
  assert.equal(store.purgeExpired(), 1);
  assert.equal(store.get(a.id), null);
  assert.ok(store.get(b.id));
});
