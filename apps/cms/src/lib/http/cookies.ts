import type { AstroCookieSetOptions } from "astro";
import { SESSION_MAX_MS } from "@/lib/security/config.ts";
import { LOGIN_CSRF_MAX_AGE_MS } from "@/lib/security/csrf.ts";

export const SESSION_COOKIE = "__Host-cms-sesion";
export const LOGIN_CSRF_COOKIE = "__Host-cms-login-csrf";

// __Host-: Secure, Path=/ y sin Domain. Los navegadores aceptan Secure también en localhost.
const BASE: AstroCookieSetOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
};

export const SESSION_COOKIE_OPTIONS: AstroCookieSetOptions = {
  ...BASE,
  maxAge: Math.floor(SESSION_MAX_MS / 1000),
};

export const LOGIN_CSRF_COOKIE_OPTIONS: AstroCookieSetOptions = {
  ...BASE,
  maxAge: Math.floor(LOGIN_CSRF_MAX_AGE_MS / 1000),
};

/** Opciones para borrar: deben cumplir los mismos requisitos __Host- para que se acepten. */
export const DELETE_COOKIE_OPTIONS = BASE;
