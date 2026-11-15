import assert from "node:assert/strict";
import { test } from "node:test";
import { isPageRequest, isPublicPath } from "../src/lib/http/public-paths.ts";

test("rutas públicas", () => {
  for (const path of [
    "/login",
    "/login/",
    "/healthz",
    "/api/sesion/iniciar",
    "/_astro/login.abc123.css",
    "/_astro/x/y.js",
  ]) {
    assert.equal(isPublicPath(path), true, path);
  }
});

test("todo lo demás exige sesión", () => {
  for (const path of [
    "/",
    "/api/sesion",
    "/api/sesion/cerrar",
    "/api/sesion/iniciar/extra",
    "/login/extra",
    "/loginx",
    "/Login",
    "/healthz/x",
    "/_astro",
    "/_astrox/a.js",
    "/_astro/../secreto",
    "/%6cogin",
    "",
  ]) {
    assert.equal(isPublicPath(path), false, path);
  }
});

test("isPageRequest: solo páginas redirigen a /login", () => {
  assert.equal(isPageRequest("/", "text/html,application/xhtml+xml,*/*;q=0.8"), true);
  assert.equal(isPageRequest("/", "*/*"), true);
  assert.equal(isPageRequest("/", null), true);
  assert.equal(isPageRequest("/ajustes", "text/html"), true);
  assert.equal(isPageRequest("/favicon.ico", "image/avif,image/webp,*/*;q=0.8"), false);
  assert.equal(isPageRequest("/favicon.ico", "text/html"), false);
  for (const path of ["/a.png", "/robots.txt", "/datos.json"]) {
    assert.equal(isPageRequest(path, null), false, path);
  }
  assert.equal(isPageRequest("/api/x", "application/json"), false);
});
