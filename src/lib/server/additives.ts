import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdditiveDetail,
  AdditiveFoodUsage,
  AdditiveListItem,
  AdditiveName,
  AdditiveRiskAssessment,
  AdditiveStudy,
  RiskLevel,
} from "$lib/types/additives";

const LIST_SELECT = `
  id,
  e_number,
  reference_name,
  category,
  additive_risk_assessment ( risk_level )
`;

type ListRow = {
  id: string;
  e_number: string;
  reference_name: string;
  category: string;
  additive_risk_assessment:
    | { risk_level: RiskLevel }
    | { risk_level: RiskLevel }[]
    | null;
};

function mapListRow(row: ListRow): AdditiveListItem {
  const risk = row.additive_risk_assessment;
  const riskLevel = Array.isArray(risk)
    ? (risk[0]?.risk_level ?? null)
    : (risk?.risk_level ?? null);

  return {
    id: row.id,
    e_number: row.e_number,
    reference_name: row.reference_name,
    category: row.category,
    risk_level: riskLevel,
  };
}

export function normalizeENumber(raw: string): string {
  return raw.trim().toUpperCase();
}

export async function getAdditiveCategories(
  supabase: SupabaseClient,
): Promise<{ categories: string[]; error: string | null }> {
  const { data, error } = await supabase
    .from("additives")
    .select("category")
    .order("category");

  if (error) {
    return { categories: [], error: error.message };
  }

  const categories = [
    ...new Set((data ?? []).map((r) => r.category).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "fr"));

  return { categories, error: null };
}

export async function getAdditives(
  supabase: SupabaseClient,
  opts: { search?: string; category?: string } = {},
): Promise<{ items: AdditiveListItem[]; error: string | null }> {
  const search = opts.search?.trim() ?? "";
  const category = opts.category?.trim() ?? "";

  let query = supabase.from("additives").select(LIST_SELECT).order("e_number");

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `e_number.ilike.${pattern},reference_name.ilike.${pattern},category.ilike.${pattern}`,
    );
  }

  const { data: primaryData, error: primaryError } = await query;

  if (primaryError) {
    return { items: [], error: primaryError.message };
  }

  const byId = new Map<string, AdditiveListItem>();
  for (const row of primaryData ?? []) {
    byId.set(row.id, mapListRow(row as ListRow));
  }

  if (search) {
    const pattern = `%${search}%`;
    const { data: nameRows, error: nameError } = await supabase
      .from("additive_names")
      .select("additive_id")
      .ilike("name", pattern);

    if (nameError) {
      return { items: [], error: nameError.message };
    }

    const extraIds = [
      ...new Set(
        (nameRows ?? [])
          .map((r) => r.additive_id)
          .filter((id) => id && !byId.has(id)),
      ),
    ];

    if (extraIds.length > 0) {
      let extraQuery = supabase
        .from("additives")
        .select(LIST_SELECT)
        .in("id", extraIds);

      if (category) {
        extraQuery = extraQuery.eq("category", category);
      }

      const { data: extraData, error: extraError } = await extraQuery;

      if (extraError) {
        return { items: [], error: extraError.message };
      }

      for (const row of extraData ?? []) {
        byId.set(row.id, mapListRow(row as ListRow));
      }
    }
  }

  const items = [...byId.values()].sort((a, b) =>
    a.e_number.localeCompare(b.e_number, "fr", { numeric: true }),
  );

  return { items, error: null };
}

export async function getAdditiveByENumber(
  supabase: SupabaseClient,
  eNumber: string,
): Promise<{ additive: AdditiveDetail | null; error: string | null }> {
  const { data, error } = await supabase
    .from("additives")
    .select(
      "id, e_number, reference_name, category, origin, description, function_description, typical_use",
    )
    .eq("e_number", eNumber)
    .maybeSingle();

  if (error) {
    return { additive: null, error: error.message };
  }

  return { additive: data as AdditiveDetail | null, error: null };
}

export async function getAdditiveRiskAssessment(
  supabase: SupabaseClient,
  additiveId: string,
): Promise<{ risk: AdditiveRiskAssessment | null; error: string | null }> {
  const { data, error } = await supabase
    .from("additive_risk_assessment")
    .select(
      "risk_level, score, reasoning, confidence_level, last_reviewed_at",
    )
    .eq("additive_id", additiveId)
    .maybeSingle();

  if (error) {
    return { risk: null, error: error.message };
  }

  if (!data) {
    return { risk: null, error: null };
  }

  return {
    risk: {
      ...data,
      score: data.score != null ? Number(data.score) : null,
    } as AdditiveRiskAssessment,
    error: null,
  };
}

export async function getAdditiveNames(
  supabase: SupabaseClient,
  additiveId: string,
): Promise<{ names: AdditiveName[]; error: string | null }> {
  const { data, error } = await supabase
    .from("additive_names")
    .select("id, name, language_code, name_type, is_preferred")
    .eq("additive_id", additiveId)
    .order("is_preferred", { ascending: false })
    .order("language_code")
    .order("name");

  if (error) {
    return { names: [], error: error.message };
  }

  return { names: (data ?? []) as AdditiveName[], error: null };
}

export async function getAdditiveFoodUsage(
  supabase: SupabaseClient,
  additiveId: string,
): Promise<{ foodUsage: AdditiveFoodUsage[]; error: string | null }> {
  const { data, error } = await supabase
    .from("additive_food_usage")
    .select("id, food_category, usage_note, example_products")
    .eq("additive_id", additiveId)
    .order("food_category");

  if (error) {
    return { foodUsage: [], error: error.message };
  }

  return { foodUsage: (data ?? []) as AdditiveFoodUsage[], error: null };
}

export async function getAdditiveStudies(
  supabase: SupabaseClient,
  additiveId: string,
): Promise<{ studies: AdditiveStudy[]; error: string | null }> {
  const { data, error } = await supabase
    .from("additive_studies")
    .select(
      `
      studies (
        id,
        title,
        authors,
        year,
        journal,
        source_type,
        study_type,
        evidence_strength,
        severity_level,
        summary,
        health_effect_summary,
        conclusion_summary,
        doi,
        url
      )
    `,
    )
    .eq("additive_id", additiveId);

  if (error) {
    return { studies: [], error: error.message };
  }

  const studies: AdditiveStudy[] = [];
  for (const row of data ?? []) {
    const study = row.studies as AdditiveStudy | AdditiveStudy[] | null;
    if (Array.isArray(study)) {
      studies.push(...study);
    } else if (study) {
      studies.push(study);
    }
  }

  studies.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  return { studies, error: null };
}
