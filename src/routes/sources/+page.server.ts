import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";

export const prerender = false;

export const load: PageServerLoad = async () => {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) {
    return {
      items: [],
      loadError:
        "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    };
  }

  const { data, error } = await supabaseServer
    .from("sources")
    .select("id, created_at, updated_at, title, url, published_at, source_name")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      items: [],
      loadError: "Impossible de charger les sources pour le moment.",
    };
  }

  return { items: data ?? [], loadError: null };
};
