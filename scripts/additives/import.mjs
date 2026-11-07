#!/usr/bin/env node
/**
 * Publie content/additives.json dans Supabase (idempotent : relançable).
 *
 * Usage :
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/additives/import.mjs [--dry-run]
 *
 * Pour chaque additif du fichier : met à jour la fiche (origine, description,
 * rôle, usages), remplace ses noms, usages alimentaires et liens vers les
 * sources, et écrit l'évaluation. Les additifs absents du fichier ne sont pas
 * touchés. Les sources sont dédupliquées par DOI.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const content = JSON.parse(readFileSync(resolve(root, "content/additives.json"), "utf8"));
const dryRun = process.argv.includes("--dry-run");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

function check(label, { error, data }) {
  if (error) throw new Error(`${label} : ${error.message}`);
  return data;
}

const existing = check(
  "lecture additives",
  await db.from("additives").select("id, e_number, reference_name, category"),
);
const byENumber = new Map(existing.map((a) => [a.e_number, a]));

const missing = content.filter((a) => !byENumber.has(a.e_number)).map((a) => a.e_number);
if (missing.length) {
  console.error(`Numéros absents de la base (ignorés) : ${missing.join(", ")}`);
}
const items = content.filter((a) => byENumber.has(a.e_number));
const ids = items.map((a) => byENumber.get(a.e_number).id);
const now = new Date().toISOString();

const additiveRows = items.map((a) => {
  const row = byENumber.get(a.e_number);
  return {
    ...row,
    origin: a.origin,
    description: a.description,
    function_description: a.function_description,
    typical_use: a.typical_use,
    updated_at: now,
  };
});

const nameRows = items.flatMap((a) => {
  const additive_id = byENumber.get(a.e_number).id;
  return [
    { additive_id, name: a.name_fr, language_code: "fr", name_type: null, is_preferred: true },
    ...a.names.map((n) => ({
      additive_id,
      name: n.name,
      language_code: n.lang,
      name_type: n.type,
      is_preferred: false,
    })),
  ];
});

const usageRows = items.flatMap((a) =>
  a.food_usage.map((u) => ({ additive_id: byENumber.get(a.e_number).id, ...u })),
);

const riskRows = items.map((a) => ({
  additive_id: byENumber.get(a.e_number).id,
  risk_level: a.risk.level,
  score: null,
  reasoning: a.risk.reasoning,
  confidence_level: a.risk.confidence,
  last_reviewed_at: now,
  updated_at: now,
}));

// Sources : une ligne par DOI (le premier résumé rencontré fait foi).
const studiesByDoi = new Map();
for (const a of items) {
  for (const s of a.studies) {
    const doi = s.doi.toLowerCase();
    if (!studiesByDoi.has(doi)) studiesByDoi.set(doi, { ...s, doi });
  }
}

console.error(
  `${items.length} additifs, ${nameRows.length} noms, ${usageRows.length} usages, ` +
    `${riskRows.length} évaluations, ${studiesByDoi.size} sources uniques.`,
);

if (dryRun) {
  console.error("--dry-run : aucune écriture.");
  process.exit(0);
}

const CHUNK = 500;
async function inChunks(label, rows, fn) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    check(label, await fn(rows.slice(i, i + CHUNK)));
  }
}

/** Suppression par paquets d'identifiants (limite de longueur d'URL). */
async function purge(label, table) {
  for (let i = 0; i < ids.length; i += 100) {
    check(label, await db.from(table).delete().in("additive_id", ids.slice(i, i + 100)));
  }
}

await inChunks("additives", additiveRows, (rows) =>
  db.from("additives").upsert(rows, { onConflict: "id" }),
);

await purge("purge noms", "additive_names");
await inChunks("noms", nameRows, (rows) => db.from("additive_names").insert(rows));

await purge("purge usages", "additive_food_usage");
await inChunks("usages", usageRows, (rows) => db.from("additive_food_usage").insert(rows));

await inChunks("évaluations", riskRows, (rows) =>
  db.from("additive_risk_assessment").upsert(rows, { onConflict: "additive_id" }),
);

// Sources : réutilise les lignes existantes de même DOI.
const knownStudies = check(
  "lecture studies",
  await db.from("studies").select("id, doi").not("doi", "is", null),
);
const studyIdByDoi = new Map(knownStudies.map((s) => [s.doi.toLowerCase(), s.id]));

const studyRows = [...studiesByDoi.values()].map((s) => ({
  ...(studyIdByDoi.has(s.doi) ? { id: studyIdByDoi.get(s.doi) } : {}),
  title: s.title,
  authors: s.authors,
  year: s.year,
  journal: s.journal,
  source_type: s.doi.startsWith("10.2903/") ? "Avis EFSA" : "Publication scientifique",
  study_type: s.study_type,
  evidence_strength: s.evidence_strength,
  summary: s.summary,
  health_effect_summary: s.health_effect_summary,
  doi: s.doi,
  updated_at: now,
}));

const toUpdate = studyRows.filter((s) => s.id);
const toInsert = studyRows.filter((s) => !s.id);
await inChunks("sources (maj)", toUpdate, (rows) =>
  db.from("studies").upsert(rows, { onConflict: "id" }),
);
for (let i = 0; i < toInsert.length; i += CHUNK) {
  const inserted = check(
    "sources (ajout)",
    await db.from("studies").insert(toInsert.slice(i, i + CHUNK)).select("id, doi"),
  );
  for (const s of inserted) studyIdByDoi.set(s.doi.toLowerCase(), s.id);
}

const linkRows = items.flatMap((a) => {
  const additive_id = byENumber.get(a.e_number).id;
  const studyIds = new Set(a.studies.map((s) => studyIdByDoi.get(s.doi.toLowerCase())));
  return [...studyIds].map((study_id) => ({ additive_id, study_id }));
});

await purge("purge liens", "additive_studies");
await inChunks("liens sources", linkRows, (rows) => db.from("additive_studies").insert(rows));

console.error("Import terminé.");
