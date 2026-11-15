import type { APIRoute } from "astro";
import { LABELS } from "@/data/labels";

export const prerender = false;

export const GET: APIRoute = ({ locals }) => {
  if (!locals.session) {
    return Response.json({ error: LABELS.errors.unauthorized }, { status: 401 });
  }
  return Response.json({ usuario: locals.session.username });
};

export const ALL: APIRoute = () =>
  new Response(LABELS.errors.methodNotAllowed, { status: 405, headers: { Allow: "GET" } });
