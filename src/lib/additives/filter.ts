import type { AdditiveListItem, RiskLevel } from "$lib/types/additives";

/** Minuscules, sans accents, espaces normalisés. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** « e 102 », « E-102 », « 102 » → « e102 ». */
function asENumberQuery(normalized: string): string | null {
  const m = normalized.match(/^e?\s*-?\s*(\d{3,4})\s*([a-z]{0,3})$/);
  return m ? `e${m[1]}${m[2]}` : null;
}

export type AdditiveFilters = {
  search: string;
  category: string;
  risk: RiskLevel | "";
};

export function filterAdditives(
  items: AdditiveListItem[],
  { search, category, risk }: AdditiveFilters,
): AdditiveListItem[] {
  const q = normalizeText(search);
  const eQuery = q ? asENumberQuery(q) : null;

  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (risk && item.risk_level !== risk) return false;
    if (!q) return true;
    if (eQuery) return item.e_number.toLowerCase().startsWith(eQuery);
    return item.search_text.includes(q);
  });
}
