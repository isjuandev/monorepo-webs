import type { APIRoute } from "astro";
import { LABELS } from "@/data/labels";
import { getRuntime } from "@/lib/security/runtime.ts";

export const prerender = false;

export const GET: APIRoute = () => {
  const ok = getRuntime().ok;
  return new Response(JSON.stringify({ status: ok ? "ok" : "error" }), {
    status: ok ? 200 : 503,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};

export const ALL: APIRoute = () =>
  new Response(LABELS.errors.methodNotAllowed, { status: 405, headers: { Allow: "GET" } });
