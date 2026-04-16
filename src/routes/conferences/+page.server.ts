import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";

export const prerender = false;

export const load: PageServerLoad = async () => {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) {
    return {
      future: [],
      past: [],
      loadError:
        "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    };
  }

  const { data, error } = await supabaseServer
    .from("conferences")
    .select(
      "id, starts_at, ends_at, venue, address, paf, country, status, ticket_url, rsvp_url",
    )
    .order("starts_at", { ascending: true });

  if (error) {
    return {
      future: [],
      past: [],
      loadError: "Impossible de charger les conférences pour le moment.",
    };
  }

  const now = Date.now();
  const future = [];
  const past = [];

  for (const item of data ?? []) {
    const startMs = new Date(item.starts_at).getTime();
    if (Number.isFinite(startMs) && startMs < now) past.push(item);
    else future.push(item);
  }

  past.reverse();

  return { future, past, loadError: null };
};

