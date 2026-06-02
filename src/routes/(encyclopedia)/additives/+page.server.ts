import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";
import {
  getAdditiveCategories,
  getAdditives,
} from "$lib/server/additives";

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get("q")?.trim() ?? "";
  const category = url.searchParams.get("category")?.trim() ?? "";

  const supabase = getSupabaseServer();
  if (!supabase) {
    return {
      items: [],
      categories: [],
      search,
      category,
      loadError:
        "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    };
  }

  const [listResult, categoriesResult] = await Promise.all([
    getAdditives(supabase, { search, category }),
    getAdditiveCategories(supabase),
  ]);

  const loadError =
    listResult.error || categoriesResult.error
      ? "Impossible de charger les additifs pour le moment."
      : null;

  return {
    items: listResult.items,
    categories: categoriesResult.categories,
    search,
    category,
    loadError,
  };
};
