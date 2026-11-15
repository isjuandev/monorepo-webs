import assert from "node:assert/strict";
import { test } from "node:test";
import {
  issueLoginCsrf,
  LOGIN_CSRF_MAX_AGE_MS,
  LOGIN_CSRF_REUSE_MIN_MS,
  reuseLoginCsrf,
  verifyLoginCsrf,
  verifySessionCsrf,
} from "../src/lib/security/csrf.ts";
import { sign } from "../src/lib/security/signing.ts";

const SECRET = "secreto-de-prueba-con-longitud-suficiente";

test("CSRF de sesión", () => {
  const session = { csrfToken: "token-valido-123" };
  assert.equal(verifySessionCsrf(session, "token-valido-123"), true);
  assert.equal(verifySessionCsrf(session, "token-valido-124"), false);
  assert.equal(verifySessionCsrf(session, "corto"), false);
  assert.equal(verifySessionCsrf(session, ""), false);
});

test("CSRF de login caduca tras 1 h", () => {
  const { cookieValue, formToken } = issueLoginCsrf(SECRET, () => 1000);
  const limit = 1000 + LOGIN_CSRF_MAX_AGE_MS;
  assert.equal(
    verifyLoginCsrf(cookieValue, formToken, SECRET, () => limit),
    true
  );
  assert.equal(
    verifyLoginCsrf(cookieValue, formToken, SECRET, () => limit + 1),
    false
  );
});

test("CSRF de login rechaza otro propósito", () => {
  const forged = sign("otro-proposito:token-abc:1000", SECRET);
  assert.equal(
    verifyLoginCsrf(forged, "token-abc", SECRET, () => 1000),
    false
  );
  assert.equal(
    verifyLoginCsrf(sign("token-abc", SECRET), "token-abc", SECRET, () => 1000),
    false
  );
});

test("CSRF de login válido", () => {
  const { cookieValue, formToken } = issueLoginCsrf(SECRET);
  assert.equal(verifyLoginCsrf(cookieValue, formToken, SECRET), true);
});

test("CSRF de login alterado", () => {
  const { cookieValue, formToken } = issueLoginCsrf(SECRET);
  const other = issueLoginCsrf(SECRET);
  assert.equal(verifyLoginCsrf(cookieValue, other.formToken, SECRET), false);
  assert.equal(verifyLoginCsrf(`${cookieValue}x`, formToken, SECRET), false);
  assert.equal(verifyLoginCsrf(cookieValue, formToken, `${SECRET}-otro`), false);
  assert.equal(verifyLoginCsrf(cookieValue, formToken.slice(1), SECRET), false);
  assert.equal(verifyLoginCsrf("", "", SECRET), false);
});

test("CSRF de login rechaza issuedAt no decimal y token vacío", () => {
  for (const payload of [
    "login-csrf:token-abc:0x10",
    "login-csrf:token-abc:1e3",
    "login-csrf:token-abc: 1000",
    "login-csrf:token-abc:",
    "login-csrf:token-abc",
    "login-csrf::1000",
  ]) {
    assert.equal(
      verifyLoginCsrf(sign(payload, SECRET), "token-abc", SECRET, () => 1000),
      false,
      payload
    );
  }
  assert.equal(
    verifyLoginCsrf(sign("login-csrf::1000", SECRET), "", SECRET, () => 1000),
    false
  );
});

test("reuseLoginCsrf reutiliza solo con margen suficiente", () => {
  const { cookieValue, formToken } = issueLoginCsrf(SECRET, () => 0);
  assert.equal(
    reuseLoginCsrf(cookieValue, SECRET, () => 1000),
    formToken
  );
  const limit = LOGIN_CSRF_MAX_AGE_MS - LOGIN_CSRF_REUSE_MIN_MS;
  assert.equal(
    reuseLoginCsrf(cookieValue, SECRET, () => limit),
    formToken
  );
  assert.equal(
    reuseLoginCsrf(cookieValue, SECRET, () => limit + 1),
    null
  );
  assert.equal(
    reuseLoginCsrf(cookieValue, SECRET, () => LOGIN_CSRF_MAX_AGE_MS + 1),
    null
  );
  assert.equal(
    reuseLoginCsrf(cookieValue, `${SECRET}x`, () => 0),
    null
  );
  assert.equal(
    reuseLoginCsrf("", SECRET, () => 0),
    null
  );
  assert.equal(
    reuseLoginCsrf(`${cookieValue}x`, SECRET, () => 0),
    null
  );
  // emitida "en el futuro": no se reutiliza
  assert.equal(
    reuseLoginCsrf(cookieValue, SECRET, () => -5),
    null
  );
});
