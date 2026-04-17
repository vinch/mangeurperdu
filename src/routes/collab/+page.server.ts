import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";

export const prerender = false;

export type FeaturedBrand = {
  slug: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  short_description: string | null;
  long_description: string | null;
  instagram_reel_url: string | null;
};

export const load: PageServerLoad = async () => {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) {
    return {
      brands: [],
      loadError:
        "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    };
  }

  const { data, error } = await supabaseServer
    .from("brands")
    .select(
      "slug, name, logo_url, website_url, short_description, long_description, instagram_reel_url, sort_order",
    )
    .eq("is_active", true)
    .eq("is_featured_on_mangeur_perdu", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    return {
      brands: [],
      loadError: "Impossible de charger la sélection pour le moment.",
    };
  }

  // Drop the ordering column from the public page payload.
  const brands: FeaturedBrand[] = (data ?? []).map((b: any) => ({
    slug: b.slug,
    name: b.name,
    logo_url: b.logo_url ?? null,
    website_url: b.website_url ?? null,
    short_description: b.short_description ?? null,
    long_description: b.long_description ?? null,
    instagram_reel_url: b.instagram_reel_url ?? null,
  }));

  return { brands, loadError: null };
};

