import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";
import {
  getAdditiveByENumber,
  getAdditiveFoodUsage,
  getAdditiveNames,
  getAdditiveRiskAssessment,
  getAdditives,
  getAdditiveStudies,
  normalizeENumber,
} from "$lib/server/additives";

export const prerender = false;

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  const normalized = normalizeENumber(params.e_number);

  if (params.e_number !== normalized) {
    throw redirect(308, `/additives/${normalized}`);
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    throw error(
      503,
      "Configuration Supabase manquante (SUPABASE_URL / SUPABASE_ANON_KEY).",
    );
  }

  const { additive, error: additiveError } = await getAdditiveByENumber(
    supabase,
    normalized,
  );

  if (additiveError) {
    throw error(503, "Impossible de charger cet additif pour le moment.");
  }

  if (!additive) {
    throw error(404, "Additif introuvable");
  }

  const [riskResult, namesResult, usageResult, studiesResult, relatedResult] =
    await Promise.all([
      getAdditiveRiskAssessment(supabase, additive.id),
      getAdditiveNames(supabase, additive.id),
      getAdditiveFoodUsage(supabase, additive.id),
      getAdditiveStudies(supabase, additive.id),
      getAdditives(supabase, { category: additive.category }),
    ]);

  const loadError =
    riskResult.error ||
    namesResult.error ||
    usageResult.error ||
    studiesResult.error
      ? "Certaines sections n'ont pas pu être chargées."
      : null;

  if (!loadError) {
    setHeaders({
      "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    });
  }

  return {
    additive,
    risk: riskResult.risk,
    names: namesResult.names,
    foodUsage: usageResult.foodUsage,
    studies: studiesResult.studies,
    related: relatedResult.items.filter((i) => i.id !== additive.id),
    loadError,
  };
};
