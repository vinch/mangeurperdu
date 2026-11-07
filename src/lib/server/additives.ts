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
import { categoryLabel } from "$lib/additives/labels";
import { normalizeText } from "$lib/additives/filter";

const LIST_SELECT = `
  id,
  e_number,
  reference_name,
  category,
  additive_risk_assessment ( risk_level ),
  additive_names ( name, language_code, is_preferred )
`;

type NameRow = { name: string; language_code: string; is_preferred: boolean };

type ListRow = {
  id: string;
  e_number: string;
  reference_name: string;
  category: string;
  additive_risk_assessment:
    | { risk_level: RiskLevel }
    | { risk_level: RiskLevel }[]
    | null;
  additive_names: NameRow[] | null;
};

export function preferredFrenchName(names: NameRow[] | null): string | null {
  const fr = (names ?? []).filter((n) => n.language_code === "fr");
  return (fr.find((n) => n.is_preferred) ?? fr[0])?.name ?? null;
}

function mapListRow(row: ListRow): AdditiveListItem {
  const risk = row.additive_risk_assessment;
  const riskLevel = Array.isArray(risk)
    ? (risk[0]?.risk_level ?? null)
    : (risk?.risk_level ?? null);
  const names = row.additive_names ?? [];

  return {
    id: row.id,
    e_number: row.e_number,
    reference_name: row.reference_name,
    name_fr: preferredFrenchName(names),
    category: row.category,
    risk_level: riskLevel,
    search_text: normalizeText(
      [
        row.e_number,
        row.reference_name,
        categoryLabel(row.category),
        ...names.map((n) => n.name),
      ].join(" | "),
    ),
  };
}

function compareENumbers(a: string, b: string): number {
  return a.localeCompare(b, "fr", { numeric: true });
}

export function normalizeENumber(raw: string): string {
  return raw.trim().toUpperCase();
}

/** Liste complète (~300 lignes) : le filtrage se fait ensuite côté page. */
export async function getAdditives(
  supabase: SupabaseClient,
  opts: { category?: string } = {},
): Promise<{ items: AdditiveListItem[]; error: string | null }> {
  let query = supabase.from("additives").select(LIST_SELECT);
  if (opts.category) {
    query = query.eq("category", opts.category);
  }

  const { data, error } = await query;

  if (error) {
    return { items: [], error: error.message };
  }

  const items = ((data ?? []) as ListRow[])
    .map(mapListRow)
    .sort((a, b) => compareENumbers(a.e_number, b.e_number));

  return { items, error: null };
}

export async function getAdditiveByENumber(
  supabase: SupabaseClient,
  eNumber: string,
): Promise<{ additive: AdditiveDetail | null; error: string | null }> {
  const { data, error } = await supabase
    .from("additives")
    .select(
      "id, e_number, reference_name, category, origin, description, function_description, typical_use, additive_names ( name, language_code, is_preferred )",
    )
    .eq("e_number", eNumber)
    .maybeSingle();

  if (error) {
    return { additive: null, error: error.message };
  }

  if (!data) {
    return { additive: null, error: null };
  }

  const { additive_names, ...rest } = data as typeof data & {
    additive_names: NameRow[] | null;
  };

  return {
    additive: {
      ...rest,
      name_fr: preferredFrenchName(additive_names),
    } as AdditiveDetail,
    error: null,
  };
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
