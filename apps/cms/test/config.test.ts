import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../src/lib/security/config.ts";

const HASH = "scrypt$16$8$1$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNoaGFzaA";
const SECRET = "s".repeat(40);
const base = {
  CMS_SESSION_SECRET: SECRET,
  CMS_USER_1: `ana-perez:${HASH}`,
  CMS_REPO_DIR: process.cwd(),
};

function messageOf(env: Record<string, string | undefined>): string {
  try {
    loadConfig(env);
  } catch (error) {
    return error instanceof Error ? error.message : "";
  }
  return "";
}

test("configuración válida", () => {
  const config = loadConfig({ ...base, CMS_USER_2: `luis:${HASH}` });
  assert.equal(config.users.size, 2);
  assert.equal(config.trustProxy, false);
  assert.equal(loadConfig({ ...base, CMS_TRUST_PROXY: "1" }).trustProxy, true);
});

test("secreto ausente o corto", () => {
  assert.match(messageOf({ ...base, CMS_SESSION_SECRET: "corto" }), /CMS_SESSION_SECRET/);
  assert.match(messageOf({ ...base, CMS_SESSION_SECRET: undefined }), /CMS_SESSION_SECRET/);
});

test("el mensaje no contiene secretos", () => {
  const message = messageOf({ ...base, CMS_SESSION_SECRET: "corto-secreto", CMS_REPO_DIR: "x" });
  assert.ok(message.length > 0);
  assert.ok(!message.includes("corto-secreto"));
  const badHash = messageOf({ ...base, CMS_USER_1: "ana:hash-secreto" });
  assert.ok(!badHash.includes("hash-secreto"));
});

test("CMS_USER_1 obligatoria y formato", () => {
  assert.match(messageOf({ ...base, CMS_USER_1: undefined }), /CMS_USER_1 es obligatoria/);
  assert.match(messageOf({ ...base, CMS_USER_1: "sinhash" }), /formato/);
  assert.match(messageOf({ ...base, CMS_USER_1: "ana:noeshash" }), /hash/);
});

test("usuario no kebab-case", () => {
  assert.match(messageOf({ ...base, CMS_USER_1: `Ana_Perez:${HASH}` }), /kebab-case/);
});

test("usuario duplicado", () => {
  assert.match(messageOf({ ...base, CMS_USER_2: `ana-perez:${HASH}` }), /repetido/);
});

test("CMS_REPO_DIR relativa o inexistente", () => {
  assert.match(messageOf({ ...base, CMS_REPO_DIR: "relativa/ruta" }), /absoluta/);
  assert.match(messageOf({ ...base, CMS_REPO_DIR: "/no/existe/seguro-xyz" }), /no existe/);
  assert.match(messageOf({ ...base, CMS_REPO_DIR: undefined }), /CMS_REPO_DIR es obligatoria/);
});

test("CMS_TRUST_PROXY inválido", () => {
  assert.match(messageOf({ ...base, CMS_TRUST_PROXY: "si" }), /CMS_TRUST_PROXY/);
});

test("lista todos los problemas a la vez", () => {
  const message = messageOf({});
  assert.match(message, /CMS_SESSION_SECRET/);
  assert.match(message, /CMS_USER_1/);
  assert.match(message, /CMS_REPO_DIR/);
});

test("más de 2 usuarios se rechaza", () => {
  assert.match(messageOf({ ...base, CMS_USER_3: `otro:${HASH}` }), /como máximo 2 usuarios/);
  assert.match(messageOf({ ...base, CMS_USER_7: `otro:${HASH}` }), /como máximo 2 usuarios/);
});

test("recorta espacios y saltos de línea", () => {
  const config = loadConfig({
    ...base,
    CMS_SESSION_SECRET: `${SECRET}\n`,
    CMS_USER_1: ` ana-perez:${HASH}\n`,
  });
  assert.equal(config.sessionSecret, SECRET);
  assert.ok(config.users.has("ana-perez"));
});

test("hash por encima de la cota de memoria se rechaza", () => {
  const huge = "scrypt$1048576$8$1$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNoaGFzaA";
  assert.match(messageOf({ ...base, CMS_USER_1: `ana:${huge}` }), /hash/);
});

test("recorta espacios en CMS_REPO_DIR y CMS_TRUST_PROXY", () => {
  const config = loadConfig({
    ...base,
    CMS_REPO_DIR: `${process.cwd()}\n`,
    CMS_TRUST_PROXY: " 1\n",
  });
  assert.equal(config.repoDir, process.cwd());
  assert.equal(config.trustProxy, true);
});
