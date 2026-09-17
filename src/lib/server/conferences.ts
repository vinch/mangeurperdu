import { getSupabaseServer } from "$lib/server/supabase";
import type { ConferenceItem, ConferencesPayload } from "$lib/types/conference";

export async function loadConferences(): Promise<ConferencesPayload> {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) {
    return {
      future: [],
      past: [],
      error:
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
      error: "Impossible de charger les conférences pour le moment.",
    };
  }

  const now = Date.now();
  const future: ConferenceItem[] = [];
  const past: ConferenceItem[] = [];

  for (const item of (data ?? []) as ConferenceItem[]) {
    const startMs = new Date(item.starts_at).getTime();
    if (Number.isFinite(startMs) && startMs < now) past.push(item);
    else future.push(item);
  }

  past.reverse();

  return { future, past, error: null };
}
