/**
 * Données publiées pour la page Méthode huiles/graisses.
 * Aucun calcul : tous les scores, notes, pondérations et contributions sont figés.
 */

export const MENTION_METHODE = "Méthode détaillée : mangeurperdu.com/fat";

export type UsageId = "cru" | "douce" | "haute";

export interface CriterionRow {
  criterion: string;
  note5: number;
  weight: number;
  contribution: number;
}

export interface OilDetail {
  name: string;
  /** Score sur 100, ou null si N/A (ex. graisses animales à cru). */
  total: number | null;
  criteria: CriterionRow[];
}

export interface WeightingRow {
  criterion: string;
  weight: number;
}

/** Noms des graisses d'origine animale (pour afficher l'icône vegan) */
export const ANIMAL_FAT_NAMES = new Set([
  "Suif de bœuf",
  "Saindoux",
  "Graisse de canard",
  "Ghee",
  "Beurre",
]);

export function isVegan(name: string): boolean {
  return !ANIMAL_FAT_NAMES.has(name);
}

/**
 * Logique Ancienneté (consommation humaine) → note /5 :
 * - depuis &lt; 50 ans → 0
 * - depuis &lt; 100 ans → 1
 * - depuis &lt; 200 ans → 2
 * - depuis &lt; 300 ans → 3
 * - depuis &lt; 400 ans → 4
 * - depuis au moins 400 ans → 5
 */
export const ANCIENNETE_YEARS_TO_NOTE: ReadonlyArray<{
  maxYears: number;
  note: number;
}> = [
  { maxYears: 50, note: 0 },
  { maxYears: 100, note: 1 },
  { maxYears: 200, note: 2 },
  { maxYears: 300, note: 3 },
  { maxYears: 400, note: 4 },
  { maxYears: Infinity, note: 5 },
];

export function ancienneteFromYears(years: number): number {
  const row = ANCIENNETE_YEARS_TO_NOTE.find((r) => years < r.maxYears);
  return row ? row.note : 5;
}

/**
 * Années de consommation humaine estimées par graisse (pour le critère Ancienneté).
 * Même produit = même durée (ex. olive EV et olive raffinée ; avocat et avocat EV).
 *
 * Détail des 20 graisses :
 * - Huile d'olive (extra vierge, raffinée) : ~4000 ans (Méditerranée antique)
 * - Huile de lin : ~3000 ans (Égypte, Rome)
 * - Huile de sésame : ~4000 ans (Asie, Moyen-Orient)
 * - Huile de noix : ~2000 ans (Europe)
 * - Huile de chanvre : ~2000 ans (Chine, usage alimentaire ancien)
 * - Beurre, ghee, saindoux, suif, graisse de canard : ~4000 ans (antiquité)
 * - Huile de coco : ~4000 ans (régions tropicales)
 * - Huile de colza (EV, raffinée) : ~200 ans (usage alimentaire Europe 19e s.)
 * - Huile d'arachide : ~150 ans (19e–20e s.)
 * - Huile de tournesol : ~200 ans (Russie/Ukraine 19e s.)
 * - Huile de maïs : ~100 ans (20e s.)
 * - Huile de soja : ~100 ans (20e s.)
 * - Huile d'avocat : ~50 ans (commercialisation récente)
 * - Huile de pépins de raisin : ~50 ans (20e s. tardif)
 */
export const OIL_CONSUMPTION_YEARS: Record<string, number> = {
  "Huile d'olive extra vierge": 4000,
  "Huile d'olive raffinée": 4000,
  "Huile de colza extra vierge": 200,
  "Huile de colza raffinée": 200,
  "Huile de lin": 3000,
  "Huile de chanvre": 2000,
  "Huile de noix": 2000,
  "Huile d'avocat extra vierge": 50,
  "Huile d'avocat": 50,
  "Huile d'arachide": 150,
  "Huile de sésame": 4000,
  "Huile de tournesol": 200,
  "Huile de maïs": 100,
  "Huile de soja": 100,
  "Huile de pépins de raisin": 50,
  Beurre: 4000,
  "Graisse de canard": 4000,
  Ghee: 4000,
  "Huile de coco": 4000,
  Saindoux: 4000,
  "Suif de bœuf": 4000,
};

export function getAncienneteNote(oilName: string): number {
  const years = OIL_CONSUMPTION_YEARS[oilName];
  return years !== undefined ? ancienneteFromYears(years) : 0;
}

// ========== GRILLES DE NOTATION (Ratio ω6/ω3, ω6 bas, ω3, Stabilité, Raffinage, Point de fumée) ==========

/** Ratio ω6/ω3 : plus le ratio est bas, mieux c’est. Si ω3 = 0, ratio = ∞ → note 0. */
const RATIO_CUTOFFS: ReadonlyArray<{ maxRatio: number; note: number }> = [
  { maxRatio: 1, note: 5 },
  { maxRatio: 2, note: 4 },
  { maxRatio: 4, note: 3 },
  { maxRatio: 10, note: 2 },
  { maxRatio: 20, note: 1 },
  { maxRatio: Infinity, note: 0 },
];
export function noteFromRatio(omega6Pct: number, omega3Pct: number): number {
  if (omega3Pct <= 0) return omega6Pct <= 0 ? 3 : 0;
  const ratio = omega6Pct / omega3Pct;
  const row = RATIO_CUTOFFS.find((r) => ratio <= r.maxRatio);
  return row ? row.note : 0;
}

/** ω6 bas : teneur en ω6 (% AG). &lt; 5% → 5, &lt; 10% → 4, …, ≥ 35% → 0. */
const OMEGA6_CUTOFFS: ReadonlyArray<{ maxPct: number; note: number }> = [
  { maxPct: 5, note: 5 },
  { maxPct: 10, note: 4 },
  { maxPct: 15, note: 3 },
  { maxPct: 25, note: 2 },
  { maxPct: 35, note: 1 },
  { maxPct: Infinity, note: 0 },
];
export function noteFromOmega6Bas(omega6Pct: number): number {
  const row = OMEGA6_CUTOFFS.find((r) => omega6Pct < r.maxPct);
  return row ? row.note : 0;
}

/** ω3 : teneur en ω3 (% AG). ≥ 50% → 5, ≥ 30% → 4, …, &lt; 1% → 0. */
const OMEGA3_CUTOFFS: ReadonlyArray<{ minPct: number; note: number }> = [
  { minPct: 50, note: 5 },
  { minPct: 30, note: 4 },
  { minPct: 15, note: 3 },
  { minPct: 5, note: 2 },
  { minPct: 1, note: 1 },
  { minPct: 0, note: 0 },
];
export function noteFromOmega3(omega3Pct: number): number {
  const row = OMEGA3_CUTOFFS.find((r) => omega3Pct >= r.minPct);
  return row ? row.note : 0;
}

/** Stabilité (indice 0–25 type Rancimat). ≥ 20 → 5, …, &lt; 2 → 0. */
const STABILITY_CUTOFFS: ReadonlyArray<{ minIndex: number; note: number }> = [
  { minIndex: 20, note: 5 },
  { minIndex: 15, note: 4 },
  { minIndex: 10, note: 3 },
  { minIndex: 5, note: 2 },
  { minIndex: 2, note: 1 },
  { minIndex: 0, note: 0 },
];
export function noteFromStability(stabilityIndex: number): number {
  const row = STABILITY_CUTOFFS.find((r) => stabilityIndex >= r.minIndex);
  return row ? row.note : 0;
}

/** Raffinage : niveau 0 (extra vierge) → note 5, niveau 5 (industriel) → note 0. */
export function noteFromRaffinage(refiningLevel: number): number {
  const n = Math.max(0, Math.min(5, Math.round(refiningLevel)));
  return 5 - n;
}

/** Point de fumée — cuisson douce (≤ 160 °C). Seuils en °C. */
const SMOKE_DOUCE_CUTOFFS: ReadonlyArray<{ minC: number; note: number }> = [
  { minC: 200, note: 5 },
  { minC: 180, note: 4 },
  { minC: 160, note: 3 },
  { minC: 140, note: 2 },
  { minC: 120, note: 1 },
  { minC: 0, note: 0 },
];
export function noteFromSmokePointDouce(smokePointC: number): number {
  const row = SMOKE_DOUCE_CUTOFFS.find((r) => smokePointC >= r.minC);
  return row ? row.note : 0;
}

/** Point de fumée — cuisson haute (&gt; 160 °C). Seuils en °C. */
const SMOKE_HAUTE_CUTOFFS: ReadonlyArray<{ minC: number; note: number }> = [
  { minC: 220, note: 5 },
  { minC: 200, note: 4 },
  { minC: 180, note: 3 },
  { minC: 160, note: 2 },
  { minC: 140, note: 1 },
  { minC: 0, note: 0 },
];
export function noteFromSmokePointHaute(smokePointC: number): number {
  const row = SMOKE_HAUTE_CUTOFFS.find((r) => smokePointC >= r.minC);
  return row ? row.note : 0;
}

/** Saturés : teneur en acides gras saturés (% AG). On pénalise un peu les graisses très riches en saturés (théories ayant longtemps diabolisé les saturés ; on garde le critère tout en restant ouvert). Moins il y a de saturés, mieux c’est : &lt; 15 % → 5, …, ≥ 65 % → 0. */
const SATURES_CUTOFFS: ReadonlyArray<{ maxPct: number; note: number }> = [
  { maxPct: 15, note: 5 },
  { maxPct: 25, note: 4 },
  { maxPct: 35, note: 3 },
  { maxPct: 50, note: 2 },
  { maxPct: 65, note: 1 },
  { maxPct: Infinity, note: 0 },
];
export function noteFromSatures(saturatedPct: number): number {
  const row = SATURES_CUTOFFS.find((r) => saturatedPct < r.maxPct);
  return row ? row.note : 0;
}

/** Données de base par huile/graisse : acides gras (%), indice stabilité 0–25, niveau raffinage 0–5, point de fumée °C. */
export interface OilBaseData {
  omega6Pct: number;
  omega3Pct: number;
  /** Teneur en acides gras saturés (% des AG totaux). Utilisé pour le critère Saturés (cuisson douce / haute). */
  saturatedPct: number;
  stabilityIndex: number;
  refiningLevel: number;
  smokePointC: number;
}

export const OIL_BASE_DATA: Record<string, OilBaseData> = {
  "Huile d'olive extra vierge": {
    omega6Pct: 10,
    omega3Pct: 0.8,
    saturatedPct: 14,
    stabilityIndex: 18,
    refiningLevel: 0,
    smokePointC: 190,
  },
  "Huile d'olive raffinée": {
    omega6Pct: 10,
    omega3Pct: 0.8,
    saturatedPct: 14,
    stabilityIndex: 20,
    refiningLevel: 3,
    smokePointC: 240,
  },
  "Huile de colza extra vierge": {
    omega6Pct: 20,
    omega3Pct: 9,
    saturatedPct: 7,
    stabilityIndex: 8,
    refiningLevel: 0,
    smokePointC: 105,
  },
  "Huile de colza raffinée": {
    omega6Pct: 20,
    omega3Pct: 9,
    saturatedPct: 7,
    stabilityIndex: 12,
    refiningLevel: 4,
    smokePointC: 204,
  },
  "Huile de lin": {
    omega6Pct: 14,
    omega3Pct: 55,
    saturatedPct: 10,
    stabilityIndex: 1,
    refiningLevel: 1,
    smokePointC: 107,
  },
  "Huile de chanvre": {
    omega6Pct: 55,
    omega3Pct: 18,
    saturatedPct: 10,
    stabilityIndex: 2,
    refiningLevel: 1,
    smokePointC: 165,
  },
  "Huile de noix": {
    omega6Pct: 52,
    omega3Pct: 10,
    saturatedPct: 9,
    stabilityIndex: 2,
    refiningLevel: 1,
    smokePointC: 160,
  },
  "Huile d'avocat extra vierge": {
    omega6Pct: 13,
    omega3Pct: 1,
    saturatedPct: 12,
    stabilityIndex: 15,
    refiningLevel: 2,
    smokePointC: 270,
  },
  "Huile d'avocat": {
    omega6Pct: 13,
    omega3Pct: 1,
    saturatedPct: 12,
    stabilityIndex: 15,
    refiningLevel: 2,
    smokePointC: 270,
  },
  "Huile d'arachide": {
    omega6Pct: 32,
    omega3Pct: 0,
    saturatedPct: 17,
    stabilityIndex: 12,
    refiningLevel: 2,
    smokePointC: 230,
  },
  "Huile de sésame": {
    omega6Pct: 41,
    omega3Pct: 0.3,
    saturatedPct: 14,
    stabilityIndex: 4,
    refiningLevel: 2,
    smokePointC: 210,
  },
  "Huile de tournesol": {
    omega6Pct: 65,
    omega3Pct: 0,
    saturatedPct: 11,
    stabilityIndex: 3,
    refiningLevel: 4,
    smokePointC: 230,
  },
  "Huile de maïs": {
    omega6Pct: 54,
    omega3Pct: 1,
    saturatedPct: 13,
    stabilityIndex: 4,
    refiningLevel: 4,
    smokePointC: 230,
  },
  "Huile de soja": {
    omega6Pct: 51,
    omega3Pct: 7,
    saturatedPct: 15,
    stabilityIndex: 4,
    refiningLevel: 4,
    smokePointC: 230,
  },
  "Huile de pépins de raisin": {
    omega6Pct: 70,
    omega3Pct: 0.3,
    saturatedPct: 10,
    stabilityIndex: 0,
    refiningLevel: 3,
    smokePointC: 216,
  },
  Beurre: {
    omega6Pct: 2,
    omega3Pct: 0.5,
    saturatedPct: 51,
    stabilityIndex: 15,
    refiningLevel: 2,
    smokePointC: 120,
  },
  "Graisse de canard": {
    omega6Pct: 13,
    omega3Pct: 0.5,
    saturatedPct: 33,
    stabilityIndex: 18,
    refiningLevel: 1,
    smokePointC: 190,
  },
  Ghee: {
    omega6Pct: 2,
    omega3Pct: 0.5,
    saturatedPct: 65,
    stabilityIndex: 22,
    refiningLevel: 2,
    smokePointC: 252,
  },
  "Huile de coco": {
    omega6Pct: 2,
    omega3Pct: 0,
    saturatedPct: 87,
    stabilityIndex: 25,
    refiningLevel: 1,
    smokePointC: 177,
  },
  Saindoux: {
    omega6Pct: 10,
    omega3Pct: 0.5,
    saturatedPct: 39,
    stabilityIndex: 20,
    refiningLevel: 1,
    smokePointC: 190,
  },
  "Suif de bœuf": {
    omega6Pct: 2,
    omega3Pct: 0.5,
    saturatedPct: 50,
    stabilityIndex: 25,
    refiningLevel: 1,
    smokePointC: 250,
  },
};

/** Documentation des échelles 0–5 par critère (pour affichage utilisateur). */
export const CRITERIA_DOCUMENTATION: ReadonlyArray<{
  criterion: string;
  description: string;
  scale: ReadonlyArray<{ note: number; label: string }>;
}> = [
  {
    criterion: "Ratio ω6/ω3",
    description:
      "Équilibre entre acides gras oméga-6 et oméga-3. Plus le ratio est bas, mieux c’est (recommandation courante : proche de 1:1 à 4:1).",
    scale: [
      { note: 5, label: "Ratio ≤ 1 (idéal type 1:1)" },
      { note: 4, label: "Ratio ≤ 2" },
      { note: 3, label: "Ratio ≤ 4" },
      { note: 2, label: "Ratio ≤ 10" },
      { note: 1, label: "Ratio ≤ 20" },
      { note: 0, label: "Ratio > 20 ou ω3 négligeable" },
    ],
  },
  {
    criterion: "ω6 bas",
    description:
      "Teneur en oméga-6 (% des acides gras). Moins il y a de ω6, mieux c’est (éviter l’excès de linoléique).",
    scale: [
      { note: 5, label: "ω6 < 5 %" },
      { note: 4, label: "ω6 < 10 %" },
      { note: 3, label: "ω6 < 15 %" },
      { note: 2, label: "ω6 < 25 %" },
      { note: 1, label: "ω6 < 35 %" },
      { note: 0, label: "ω6 ≥ 35 %" },
    ],
  },
  {
    criterion: "ω3",
    description:
      "Teneur en oméga-3 (% des acides gras). Plus il y a de ω3, mieux c’est.",
    scale: [
      { note: 5, label: "ω3 ≥ 50 %" },
      { note: 4, label: "ω3 ≥ 30 %" },
      { note: 3, label: "ω3 ≥ 15 %" },
      { note: 2, label: "ω3 ≥ 5 %" },
      { note: 1, label: "ω3 ≥ 1 %" },
      { note: 0, label: "ω3 < 1 %" },
    ],
  },
  {
    criterion: "Stabilité",
    description:
      "Résistance à l’oxydation (indice type Rancimat, 0–25). Plus la graisse est stable à la chaleur, mieux c’est.",
    scale: [
      { note: 5, label: "Indice ≥ 20 (très stable)" },
      { note: 4, label: "Indice ≥ 15" },
      { note: 3, label: "Indice ≥ 10" },
      { note: 2, label: "Indice ≥ 5" },
      { note: 1, label: "Indice ≥ 2" },
      { note: 0, label: "Indice < 2 (très peu stable)" },
    ],
  },
  {
    criterion: "Raffinage",
    description:
      "Degré de transformation. Moins raffiné = meilleur pour le goût et les micronutriments (extra vierge = note max).",
    scale: [
      { note: 5, label: "Extra vierge / non raffinée" },
      { note: 4, label: "Vierge / traitement minimal" },
      { note: 3, label: "Raffinage léger" },
      { note: 2, label: "Raffinée (classique)" },
      { note: 1, label: "Très raffinée" },
      { note: 0, label: "Industrielle (solvant, désodorisation)" },
    ],
  },
  {
    criterion: "Point de fumée (cuisson douce)",
    description:
      "Température de fumage en °C. Pour la cuisson douce (≤ 160 °C), un point de fumée ≥ 160 °C est suffisant.",
    scale: [
      { note: 5, label: "≥ 200 °C" },
      { note: 4, label: "≥ 180 °C" },
      { note: 3, label: "≥ 160 °C" },
      { note: 2, label: "≥ 140 °C" },
      { note: 1, label: "≥ 120 °C" },
      { note: 0, label: "< 120 °C" },
    ],
  },
  {
    criterion: "Point de fumée (cuisson haute)",
    description:
      "Température de fumage en °C. Pour la cuisson haute (friture, > 160 °C), un point de fumée élevé est nécessaire.",
    scale: [
      { note: 5, label: "≥ 220 °C" },
      { note: 4, label: "≥ 200 °C" },
      { note: 3, label: "≥ 180 °C" },
      { note: 2, label: "≥ 160 °C" },
      { note: 1, label: "≥ 140 °C" },
      { note: 0, label: "< 140 °C" },
    ],
  },
  {
    criterion: "Ancienneté",
    description:
      "Depuis combien de temps l’huile ou la graisse est consommée par l’humain. Valorise les usages éprouvés.",
    scale: [
      { note: 5, label: "Consommation depuis au moins 400 ans" },
      { note: 4, label: "Depuis moins de 400 ans" },
      { note: 3, label: "Depuis moins de 300 ans" },
      { note: 2, label: "Depuis moins de 200 ans" },
      { note: 1, label: "Depuis moins de 100 ans" },
      { note: 0, label: "Depuis moins de 50 ans" },
    ],
  },
  {
    criterion: "Saturés",
    description:
      "Teneur en acides gras saturés (% des AG). Utilisé uniquement pour la cuisson douce et la cuisson haute. On pénalise un peu les graisses très riches en saturés, pour rester ouvert aux théories qui les ont longtemps diabolisés (les données récentes les réhabilitent en partie ; le critère reste pondéré faiblement, 5).",
    scale: [
      { note: 5, label: "Saturés < 15 %" },
      { note: 4, label: "Saturés < 25 %" },
      { note: 3, label: "Saturés < 35 %" },
      { note: 2, label: "Saturés < 50 %" },
      { note: 1, label: "Saturés < 65 %" },
      { note: 0, label: "Saturés ≥ 65 %" },
    ],
  },
];

function contribution(note5: number, weight: number): number {
  return Math.round((note5 / 5) * weight);
}

function buildCriteriaRow(
  criterion: string,
  note5: number,
  weight: number
): CriterionRow {
  return {
    criterion,
    note5,
    weight,
    contribution: contribution(note5, weight),
  };
}

const CRU_NA_NAMES = new Set([
  "Beurre",
  "Graisse de canard",
  "Ghee",
  "Huile de coco",
  "Saindoux",
  "Suif de bœuf",
]);

/** Construit une entrée CRU à partir des données de base (huiles avec critères). Les N/A (graisses animales, coco) sont hors périmètre. */
function buildCruEntry(name: string): OilDetail {
  if (CRU_NA_NAMES.has(name)) return { name, total: null, criteria: [] };
  const base = OIL_BASE_DATA[name];
  const years = OIL_CONSUMPTION_YEARS[name];
  if (!base || years === undefined) return { name, total: null, criteria: [] };
  const weights = WEIGHTINGS_BY_USAGE.cru;
  const stab = noteFromStability(base.stabilityIndex);
  const ratio = noteFromRatio(base.omega6Pct, base.omega3Pct);
  const omega6Bas = noteFromOmega6Bas(base.omega6Pct);
  const omega3 = noteFromOmega3(base.omega3Pct);
  const raff = noteFromRaffinage(base.refiningLevel);
  const anc = getAncienneteNote(name);
  const criteria: CriterionRow[] = [
    buildCriteriaRow("Ratio ω6/ω3", ratio, 35),
    buildCriteriaRow("Raffinage", raff, 35),
    buildCriteriaRow("Stabilité", stab, 5),
    buildCriteriaRow("ω6 bas", omega6Bas, 10),
    buildCriteriaRow("ω3", omega3, 10),
    buildCriteriaRow("Ancienneté", anc, 5),
  ];
  const total = criteria.reduce((s, c) => s + c.contribution, 0);
  return { name, total, criteria };
}

/** Construit une entrée DOUCE à partir des données de base. */
function buildDouceEntry(name: string): OilDetail {
  const base = OIL_BASE_DATA[name];
  const years = OIL_CONSUMPTION_YEARS[name];
  if (!base || years === undefined) return { name, total: null, criteria: [] };
  const stab = noteFromStability(base.stabilityIndex);
  const raff = noteFromRaffinage(base.refiningLevel);
  const omega6Bas = noteFromOmega6Bas(base.omega6Pct);
  const anc = getAncienneteNote(name);
  const smoke = noteFromSmokePointDouce(base.smokePointC);
  const satures = noteFromSatures(base.saturatedPct);
  const criteria: CriterionRow[] = [
    buildCriteriaRow("Stabilité", stab, 40),
    buildCriteriaRow("Point de fumée", smoke, 15),
    buildCriteriaRow("Raffinage", raff, 20),
    buildCriteriaRow("ω6 bas", omega6Bas, 15),
    buildCriteriaRow("Saturés", satures, 5),
    buildCriteriaRow("Ancienneté", anc, 5),
  ];
  const total = criteria.reduce((s, c) => s + c.contribution, 0);
  return { name, total, criteria };
}

/** Construit une entrée HAUTE à partir des données de base. */
function buildHauteEntry(name: string): OilDetail {
  const base = OIL_BASE_DATA[name];
  const years = OIL_CONSUMPTION_YEARS[name];
  if (!base || years === undefined) return { name, total: null, criteria: [] };
  const stab = noteFromStability(base.stabilityIndex);
  const smoke = noteFromSmokePointHaute(base.smokePointC);
  const raff = noteFromRaffinage(base.refiningLevel);
  const anc = getAncienneteNote(name);
  const omega6Bas = noteFromOmega6Bas(base.omega6Pct);
  const satures = noteFromSatures(base.saturatedPct);
  const criteria: CriterionRow[] = [
    buildCriteriaRow("Stabilité", stab, 45),
    buildCriteriaRow("Point de fumée", smoke, 30),
    buildCriteriaRow("Raffinage", raff, 10),
    buildCriteriaRow("Ancienneté", anc, 5),
    buildCriteriaRow("Saturés", satures, 5),
    buildCriteriaRow("ω6 bas", omega6Bas, 5),
  ];
  const total = criteria.reduce((s, c) => s + c.contribution, 0);
  return { name, total, criteria };
}

const CRU_ORDER = [
  "Huile d'olive extra vierge",
  "Huile de colza extra vierge",
  "Huile de lin",
  "Huile d'olive raffinée",
  "Huile de chanvre",
  "Huile de noix",
  "Huile d'avocat extra vierge",
  "Huile de colza raffinée",
  "Huile d'arachide",
  "Huile de sésame",
  "Huile de tournesol",
  "Huile de maïs",
  "Huile de soja",
  "Huile de pépins de raisin",
  "Beurre",
  "Graisse de canard",
  "Ghee",
  "Huile de coco",
  "Saindoux",
  "Suif de bœuf",
];

const DOUCE_ORDER = [
  "Huile d'olive extra vierge",
  "Suif de bœuf",
  "Huile de coco",
  "Saindoux",
  "Graisse de canard",
  "Ghee",
  "Beurre",
  "Huile d'olive raffinée",
  "Huile d'avocat",
  "Huile de colza raffinée",
  "Huile d'arachide",
  "Huile de sésame",
  "Huile de colza extra vierge",
  "Huile de chanvre",
  "Huile de noix",
  "Huile de lin",
  "Huile de tournesol",
  "Huile de maïs",
  "Huile de soja",
  "Huile de pépins de raisin",
];

const HAUTE_ORDER = [
  "Suif de bœuf",
  "Huile de coco",
  "Ghee",
  "Saindoux",
  "Graisse de canard",
  "Huile d'avocat",
  "Huile d'olive raffinée",
  "Huile d'olive extra vierge",
  "Beurre",
  "Huile d'arachide",
  "Huile de colza raffinée",
  "Huile de sésame",
  "Huile de colza extra vierge",
  "Huile de noix",
  "Huile de chanvre",
  "Huile de lin",
  "Huile de tournesol",
  "Huile de maïs",
  "Huile de soja",
  "Huile de pépins de raisin",
];

/** Trie les pondérations par poids décroissant pour l'affichage. */
function weightingsByDescWeight(rows: WeightingRow[]): WeightingRow[] {
  return [...rows].sort((a, b) => b.weight - a.weight);
}

/** Pondérations par usage (labels courts), ordonnées dynamiquement par pondération décroissante. */
export const WEIGHTINGS_BY_USAGE: Record<UsageId, WeightingRow[]> = {
  cru: weightingsByDescWeight([
    { criterion: "Ratio ω6/ω3", weight: 35 },
    { criterion: "Raffinage", weight: 35 },
    { criterion: "Stabilité", weight: 5 },
    { criterion: "ω6 bas", weight: 10 },
    { criterion: "ω3", weight: 10 },
    { criterion: "Ancienneté", weight: 5 },
  ]),
  douce: weightingsByDescWeight([
    { criterion: "Stabilité", weight: 40 },
    { criterion: "Point de fumée", weight: 15 },
    { criterion: "Raffinage", weight: 20 },
    { criterion: "ω6 bas", weight: 15 },
    { criterion: "Saturés", weight: 5 },
    { criterion: "Ancienneté", weight: 5 },
  ]),
  haute: weightingsByDescWeight([
    { criterion: "Stabilité", weight: 45 },
    { criterion: "Point de fumée", weight: 30 },
    { criterion: "Raffinage", weight: 10 },
    { criterion: "Ancienneté", weight: 5 },
    { criterion: "Saturés", weight: 5 },
    { criterion: "ω6 bas", weight: 5 },
  ]),
};

/** CRU — Détail dérivé des données de base et des grilles de notation. */
export const DETAIL_CRU: OilDetail[] = CRU_ORDER.map(buildCruEntry);

/** CUISSON DOUCE — Détail dérivé des données de base et des grilles. */
export const DETAIL_DOUCE: OilDetail[] = DOUCE_ORDER.map(buildDouceEntry);

/** CUISSON HAUTE — Détail dérivé des données de base et des grilles. */
export const DETAIL_HAUTE: OilDetail[] = HAUTE_ORDER.map(buildHauteEntry);

export const DETAIL_BY_USAGE: Record<UsageId, OilDetail[]> = {
  cru: DETAIL_CRU,
  douce: DETAIL_DOUCE,
  haute: DETAIL_HAUTE,
};

/** Huiles à éviter (toutes situations) */
export const OILS_TO_AVOID = [
  "Tournesol",
  "Maïs",
  "Soja",
  "Pépins de raisin",
  "Mélanges « huile végétale »",
];

/** FAQ : ordre du plus abstrait (logique du modèle) au plus spécifique (cas particuliers). */
export const FAQ: Array<{ question: string; answer: string }> = [
  {
    question:
      "Pourquoi le classement change-t-il selon l'usage (cru, cuisson douce, cuisson haute) ?",
    answer:
      "Chaque critère est noté sur 5 et pondéré selon l'usage. Le modèle ne modifie pas les données de base mais l'importance relative des critères. À cru, l'équilibre lipidique (ratio ω6/ω3), le degré de raffinage et la qualité intrinsèque de la graisse comptent davantage. En cuisson douce, la stabilité oxydative et la résistance thermique prennent le pas, tout en gardant une composante d'évaluation nutritionnelle. En cuisson haute, la résistance à l'oxydation et le point de fumée deviennent déterminants, la stabilité chimique à haute température étant prioritaire. Les scores affichés correspondent à la version actuelle du modèle, issus d'un système de pondération prédéfini.",
  },
  {
    question: "D'où viennent les scores sur 100 ?",
    answer:
      "Les scores sont dérivés de données de base (composition en acides gras, stabilité, degré de raffinage, point de fumée, ancienneté d'usage) et de grilles de notation explicites (0/5 à 5/5) pour chaque critère. Chaque note est convertie en contribution (note/5 × poids), puis les contributions sont sommées pour obtenir le total sur 100. Vous pouvez consulter la section « Comprendre les notes » dans la Méthode pour le détail des grilles.",
  },
  {
    question: "Le modèle est-il biaisé en faveur des graisses animales ?",
    answer:
      "Le modèle ne privilégie ni les graisses animales ni les huiles végétales en tant que catégories. Il applique des critères mesurables pour le classement : stabilité à l'oxydation, point de fumée, degré de raffinage, profil en acides gras, ancienneté d'usage, avec des pondérations adaptées à chaque usage. Si certaines graisses animales figurent en tête pour la cuisson haute, c'est en raison de leur forte stabilité oxydative et de leur faible teneur en acides gras polyinsaturés, donc d'une moindre sensibilité à la dégradation thermique. Inversement, nombre d'huiles végétales excellent à cru grâce à leur profil en oméga-3 ou à un raffinage limité. Le classement reflète ces critères objectifs, pas une préférence idéologique.",
  },
  {
    question: "Le modèle est-il évolutif ?",
    answer:
      "Oui. Le modèle est volontairement versionné. Les pondérations retenues comportent une part d'arbitraire, tout en s'appuyant sur des données scientifiques (oxydation, stabilité thermique, composition lipidique). L'objectif est la transparence : les critères sont affichés, les poids peuvent évoluer. Si de nouvelles données robustes émergent ou si le consensus scientifique évolue, les pondérations pourront être ajustées. Le classement constitue une photographie méthodologique à un instant donné, pas une vérité figée.",
  },
  {
    question:
      "Que recouvrent les termes « cuisson douce » et « cuisson haute » ?",
    answer:
      "La cuisson douce correspond typiquement à des températures inférieures ou égales à 160 °C (vapeur, étouffée, poêle à feu doux). La cuisson haute désigne les températures au-dessus de 160 °C (rissolage, friture, environ 160–200 °C et plus). La frontière entre les deux est fixée ici à 160 °C ; elle peut varier selon les sources.",
  },
  {
    question: "Que mesure concrètement le critère de stabilité à l'oxydation ?",
    answer:
      "L'oxydation des lipides est une dégradation chimique qui altère la qualité des graisses et peut générer des composés indésirables (rancissement, perte de nutriments). La chaleur et l'oxygène accélèrent ce phénomène. Le critère « stabilité à l'oxydation » reflète la résistance de la graisse à cette dégradation ; il s'appuie sur des indicateurs mesurables (par exemple un indice de type Rancimat). Plus une graisse est stable, moins elle se dégrade rapidement à la chaleur. C'est pourquoi ce critère est central pour les usages en cuisson : il permet de distinguer les graisses adaptées au chauffage de celles qui sont plus fragiles et à réserver de préférence à cru.",
  },
  {
    question: "Une huile stable est-elle forcément saine ?",
    answer:
      "Non. La stabilité thermique indique uniquement la résistance à l'oxydation et à la dégradation à la chaleur. Une graisse très stable peut convenir à la friture sans produire rapidement des composés oxydés, sans pour autant être « idéale » dans tous les contextes nutritionnels. Le modèle distingue les usages : à cru, le profil en acides gras et le degré de transformation comptent davantage ; en cuisson haute, la priorité est de limiter une oxydation excessive. La stabilité est un critère fonctionnel, pas un label santé absolu.",
  },
  {
    question: "Qu'est-ce que le point de fumée ?",
    answer:
      "Le point de fumée est la température à laquelle une huile ou une graisse commence à fumer et à se dégrader. Au-delà, des composés indésirables peuvent se former et le goût s'altérer. Plus le point de fumée est élevé, plus la graisse convient aux cuissons à feu vif ; c'est ce critère (avec la stabilité à l'oxydation, pondérée à part) qui guide le classement pour la cuisson douce et la cuisson haute.",
  },
  {
    question: "Pourquoi l'ancienneté d'usage est-elle prise en compte ?",
    answer:
      "L'ancienneté ne signifie pas « ancien = meilleur ». Ce critère intègre une dimension historique et anthropologique : certaines graisses sont consommées depuis des siècles ou des millénaires dans différentes cultures, ce qui offre un recul empirique important. C'est un critère secondaire (pondération faible), qui permet toutefois de distinguer des produits très récents dans l'alimentation humaine des graisses traditionnelles dont les usages culinaires et les effets à long terme sont mieux documentés. Il n'est pas absolu ; il contribue au score sans en être le seul déterminant.",
  },
  {
    question:
      "Pourquoi la pondération sur les graisses saturées est si basse ?",
    answer:
      "Les graisses saturées ont longtemps été diabolisées (maladies cardiovasculaires, cholestérol), mais les données scientifiques récentes nuance fortement ce discours : le lien n'est pas aussi net qu'on l'a cru, et le contexte alimentaire global compte davantage. On garde donc un critère « Saturés » pour refléter cette prudence historique, mais avec une pondération faible (5 sur 100) : on ne souhaite pas sur-pénaliser des graisses comme le beurre, le ghee ou l'huile de coco au seul motif de leur teneur en saturés.",
  },
  {
    question:
      "Pourquoi une telle différence entre extra vierge et raffinée (olive, colza) ?",
    answer:
      "L'extra vierge est obtenue par extraction à froid, sans raffinage : elle conserve polyphénols, vitamines et goût, ce qui la rend particulièrement adaptée à cru. En revanche, elle est plus sensible à l'oxydation à forte chaleur et son point de fumée est plus bas. La raffinée subit un procédé physique ou chimique (chaleur, parfois solvants), qui lui donne un goût neutre, un point de fumée plus élevé et une meilleure stabilité en friture, mais au prix d'une perte importante de micronutriments et d'antioxydants — elle est donc moins intéressante à cru. Le classement reflète ces compromis selon l'usage.",
  },
  {
    question:
      "Pourquoi l'huile d'olive raffinée peut-elle dépasser l'extra vierge en cuisson haute ?",
    answer:
      "En cuisson haute, deux critères dominent : stabilité à l'oxydation et point de fumée. L'huile d'olive raffinée, ayant subi un processus de purification, possède généralement un point de fumée plus élevé et une meilleure résistance thermique que l'extra vierge. L'huile d'olive extra vierge conserve davantage de composés bioactifs (polyphénols), ce qui est un avantage à cru, mais ces composés peuvent se dégrader à très haute température. Le classement ne dit donc pas que la raffinée est « meilleure » globalement ; il indique qu'elle est plus adaptée à un usage spécifique (cuisson intense).",
  },
  {
    question: "Pourquoi certaines graisses sont N/A à cru ?",
    answer:
      "Les graisses animales (suif, saindoux, graisse de canard, ghee, beurre) ne sont pas évaluées à cru dans ce classement : l'usage « à cru » concerne les huiles pour assaisonnement ou consommation froide. Les graisses animales sont donc hors périmètre pour cet usage.",
  },
];
