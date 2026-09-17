import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { loadConferences } from "$lib/server/conferences";

export const prerender = false;

export const GET: RequestHandler = async () => {
  const payload = await loadConferences();

  if (payload.error) {
    const status = payload.error.includes("Configuration Supabase")
      ? 503
      : 502;
    return json(payload, { status });
  }

  return json(payload);
};
