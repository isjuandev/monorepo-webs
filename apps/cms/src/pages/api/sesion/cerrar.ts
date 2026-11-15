import type { APIRoute } from "astro";
import { LABELS } from "@/data/labels";
import { DELETE_COOKIE_OPTIONS, SESSION_COOKIE } from "@/lib/http/cookies.ts";
import { getRuntime } from "@/lib/security/runtime.ts";

export const prerender = false;

// La sesión y el CSRF de sesión los exige el middleware antes de llegar aquí.
export const POST: APIRoute = ({ locals, cookies, redirect }) => {
  const state = getRuntime();
  if (!state.ok) return new Response(LABELS.errors.unavailable, { status: 503 });
  if (!locals.session) return Response.json({ error: LABELS.errors.unauthorized }, { status: 401 });
  state.runtime.sessions.destroy(locals.session.id);
  cookies.delete(SESSION_COOKIE, DELETE_COOKIE_OPTIONS);
  return redirect("/login", 303);
};

export const ALL: APIRoute = () =>
  new Response(LABELS.errors.methodNotAllowed, { status: 405, headers: { Allow: "POST" } });
