export type RiskLevel = "blue" | "yellow" | "red";

export type AdditiveListItem = {
  id: string;
  e_number: string;
  reference_name: string;
  category: string;
  risk_level: RiskLevel | null;
};

export type AdditiveDetail = {
  id: string;
  e_number: string;
  reference_name: string;
  category: string;
  origin: string | null;
  description: string | null;
  function_description: string | null;
  typical_use: string | null;
};

export type AdditiveRiskAssessment = {
  risk_level: RiskLevel;
  score: number | null;
  reasoning: string | null;
  confidence_level: string | null;
  last_reviewed_at: string | null;
};

export type AdditiveName = {
  id: string;
  name: string;
  language_code: string;
  name_type: string | null;
  is_preferred: boolean;
};

export type AdditiveFoodUsage = {
  id: string;
  food_category: string;
  usage_note: string | null;
  example_products: string | null;
};

export type AdditiveStudy = {
  id: string;
  title: string;
  authors: string | null;
  year: number | null;
  journal: string | null;
  source_type: string | null;
  study_type: string | null;
  evidence_strength: string | null;
  severity_level: string | null;
  summary: string | null;
  health_effect_summary: string | null;
  conclusion_summary: string | null;
  doi: string | null;
  url: string | null;
};

export type AdditivesListingPageData = {
  items: AdditiveListItem[];
  categories: string[];
  search: string;
  category: string;
  loadError: string | null;
};

export type AdditiveDetailPageData = {
  additive: AdditiveDetail;
  risk: AdditiveRiskAssessment | null;
  names: AdditiveName[];
  foodUsage: AdditiveFoodUsage[];
  studies: AdditiveStudy[];
  loadError: string | null;
};
