import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getSupabaseServer } from "$lib/server/supabase";
import {
  getAdditiveByENumber,
  getAdditiveFoodUsage,
  getAdditiveNames,
  getAdditiveRiskAssessment,
  getAdditiveStudies,
  normalizeENumber,
} from "$lib/server/additives";

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
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
    return {
      additive: null,
      risk: null,
      names: [],
      foodUsage: [],
      studies: [],
      loadError: "Impossible de charger cet additif pour le moment.",
    };
  }

  if (!additive) {
    throw error(404, "Additif introuvable");
  }

  const [riskResult, namesResult, usageResult, studiesResult] = await Promise.all(
    [
      getAdditiveRiskAssessment(supabase, additive.id),
      getAdditiveNames(supabase, additive.id),
      getAdditiveFoodUsage(supabase, additive.id),
      getAdditiveStudies(supabase, additive.id),
    ],
  );

  const loadError =
    riskResult.error ||
    namesResult.error ||
    usageResult.error ||
    studiesResult.error
      ? "Certaines sections n'ont pas pu être chargées."
      : null;

  return {
    additive,
    risk: riskResult.risk,
    names: namesResult.names,
    foodUsage: usageResult.foodUsage,
    studies: studiesResult.studies,
    loadError,
  };
};
