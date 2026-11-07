import type { RiskLevel } from "$lib/types/additives";

/** Catégories techniques (slugs stockés en base) → libellé français. */
export const CATEGORY_LABELS: Record<string, string> = {
  acidity_regulator: "Correcteur d’acidité",
  anti_caking_agent: "Antiagglomérant",
  antioxidant: "Antioxydant",
  carrier: "Support",
  color: "Colorant",
  emulsifier: "Émulsifiant",
  firming_agent: "Affermissant",
  flavor_enhancer: "Exhausteur de goût",
  flour_treatment_agent: "Agent de traitement de la farine",
  foaming_agent: "Agent moussant",
  gelling_agent: "Gélifiant",
  glazing_agent: "Agent d’enrobage",
  humectant: "Humectant",
  other: "Autre",
  packaging_gas: "Gaz d’emballage",
  preservative: "Conservateur",
  raising_agent: "Poudre à lever",
  sequestrant: "Séquestrant",
  stabilizer: "Stabilisant",
  sweetener: "Édulcorant",
  thickener: "Épaississant",
};

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replaceAll("_", " ");
}

export const ORIGIN_LABELS: Record<string, string> = {
  vegetal: "Végétale",
  animal: "Animale",
  mineral: "Minérale",
  microbial: "Fermentation microbienne",
  synthetic: "Synthèse chimique",
  semi_synthetic: "Substance naturelle modifiée chimiquement",
  variable: "Variable selon le fabricant (végétale, animale ou synthétique)",
};

/** Retourne null pour les origines inconnues : rien à afficher. */
export function originLabel(origin: string | null): string | null {
  if (!origin || origin === "unknown") return null;
  return ORIGIN_LABELS[origin] ?? origin;
}

export const RISK_LEVELS: RiskLevel[] = ["blue", "yellow", "red"];

export const RISK_SHORT_LABELS: Record<RiskLevel, string> = {
  blue: "Pas de signal préoccupant",
  yellow: "À surveiller",
  red: "Préoccupant",
};

export const RISK_LONG_LABELS: Record<RiskLevel, string> = {
  blue: "Aucun signal préoccupant documenté à ce stade",
  yellow: "Signaux ou incertitudes à surveiller",
  red: "Signaux préoccupants ou restriction forte",
};

export function isRiskLevel(value: string): value is RiskLevel {
  return (RISK_LEVELS as string[]).includes(value);
}

const LANGUAGE_LABELS: Record<string, string> = {
  fr: "Français",
  en: "Anglais",
};

export function languageLabel(code: string): string {
  return LANGUAGE_LABELS[code] ?? code.toUpperCase();
}
