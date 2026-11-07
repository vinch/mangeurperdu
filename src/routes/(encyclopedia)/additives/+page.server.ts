import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";
import { getAdditives } from "$lib/server/additives";
import { categoryLabel, isRiskLevel } from "$lib/additives/labels";

export const prerender = false;

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  const search = url.searchParams.get("q")?.trim() ?? "";
  const category = url.searchParams.get("category")?.trim() ?? "";
  const riskParam = url.searchParams.get("risk")?.trim() ?? "";
  const risk = isRiskLevel(riskParam) ? riskParam : "";

  const supabase = getSupabaseServer();
  if (!supabase) {
    return {
      items: [],
      categories: [],
      search,
      category,
      risk,
      loadError:
        "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    };
  }

  // Toute la liste est chargée : les filtres s'appliquent ensuite dans la page,
  // instantanément côté client et aussi au rendu serveur (sans JS).
  const { items, error } = await getAdditives(supabase);

  if (!error) {
    setHeaders({
      "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    });
  }

  const categories = [...new Set(items.map((i) => i.category))].sort((a, b) =>
    categoryLabel(a).localeCompare(categoryLabel(b), "fr"),
  );

  return {
    items,
    categories,
    search,
    category,
    risk,
    loadError: error ? "Impossible de charger les additifs pour le moment." : null,
  };
};
