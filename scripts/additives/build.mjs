#!/usr/bin/env node
/**
 * Assemble le contenu éditorial des additifs à partir de fichiers de travail
 * (batch_*_out.json), le valide, et vérifie chaque source sur Crossref.
 *
 * Usage : node scripts/additives/build.mjs <batch.json>... > /dev/null
 * Sortie : content/additives.json (source de vérité versionnée).
 *
 * Une source n'est gardée que si son DOI existe sur Crossref ET que le titre
 * Crossref correspond au titre annoncé : les métadonnées (titre, auteurs,
 * revue, année) viennent ensuite de Crossref, pas du texte rédigé.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = resolve(root, "content/additives.json");
const cachePath = resolve(root, ".context/crossref-cache.json");

const ORIGINS = new Set([
  "vegetal",
  "animal",
  "mineral",
  "microbial",
  "synthetic",
  "semi_synthetic",
  "variable",
]);
const LEVELS = new Set(["blue", "yellow", "red"]);
const CONFIDENCE = new Set(["élevée", "moyenne", "faible"]);

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error("Usage: node scripts/additives/build.mjs <batch.json>...");
  process.exit(1);
}

const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

function norm(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Recouvrement de mots significatifs entre deux titres (0..1). */
function titleSimilarity(a, b) {
  const words = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 2));
  const A = words(a);
  const B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  return inter / Math.min(A.size, B.size);
}

async function crossref(doi) {
  const key = doi.toLowerCase();
  if (key in cache) return cache[key];
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { "User-Agent": "mangeurperdu.com additives encyclopedia (+https://mangeurperdu.com/additives)" },
  });
  let value = null;
  if (res.ok) {
    const m = (await res.json()).message;
    const authors = (m.author ?? [])
      .map((a) => a.family ?? a.name)
      .filter(Boolean);
    value = {
      title: (m.title?.[0] ?? "").replace(/\s+/g, " ").trim(),
      authors:
        authors.length > 3
          ? `${authors.slice(0, 3).join(", ")} et al.`
          : authors.join(", ") || null,
      journal: m["container-title"]?.[0] ?? null,
      year: m.issued?.["date-parts"]?.[0]?.[0] ?? m.published?.["date-parts"]?.[0]?.[0] ?? null,
    };
  } else if (res.status !== 404) {
    throw new Error(`Crossref ${res.status} for ${doi}`);
  }
  cache[key] = value;
  return value;
}

function cleanDoi(doi) {
  return String(doi ?? "")
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "");
}

const errors = [];
const rejectedStudies = [];
const additives = [];
const seen = new Set();

for (const file of inputs) {
  const batch = JSON.parse(readFileSync(file, "utf8"));
  for (const a of batch) {
    const where = `${a.e_number ?? "?"} (${file})`;
    if (!a.e_number || seen.has(a.e_number)) errors.push(`${where}: e_number manquant ou en double`);
    seen.add(a.e_number);
    if (!a.name_fr) errors.push(`${where}: name_fr manquant`);
    if (!ORIGINS.has(a.origin)) errors.push(`${where}: origin invalide « ${a.origin} »`);
    if (!a.description) errors.push(`${where}: description manquante`);
    if (!LEVELS.has(a.risk?.level)) errors.push(`${where}: risk.level invalide`);
    if (!CONFIDENCE.has(a.risk?.confidence)) errors.push(`${where}: risk.confidence invalide « ${a.risk?.confidence} »`);
    if (!a.risk?.reasoning) errors.push(`${where}: risk.reasoning manquant`);

    const studies = [];
    for (const s of a.key_studies ?? []) {
      const doi = cleanDoi(s.doi);
      if (!doi) continue;
      const meta = await crossref(doi);
      const sim = meta ? titleSimilarity(meta.title, s.title_hint) : 0;
      if (!meta || sim < 0.6) {
        rejectedStudies.push({ e_number: a.e_number, doi, hint: s.title_hint, found: meta?.title ?? null, sim: +sim.toFixed(2) });
        continue;
      }
      studies.push({
        doi,
        title: meta.title,
        authors: meta.authors,
        journal: meta.journal,
        year: meta.year,
        study_type: s.study_type ?? null,
        evidence_strength: s.evidence_strength ?? null,
        summary: s.summary_fr ?? null,
        health_effect_summary: s.health_effect_fr ?? null,
      });
    }

    const names = [];
    const seenNames = new Set([norm(a.name_fr)]);
    for (const n of a.other_names ?? []) {
      const k = norm(n.name);
      if (!k || seenNames.has(k)) continue;
      seenNames.add(k);
      names.push({ name: n.name.trim(), lang: n.lang === "en" ? "en" : "fr", type: n.type ?? null });
    }

    additives.push({
      e_number: a.e_number,
      name_fr: a.name_fr.trim(),
      names,
      origin: a.origin,
      description: a.description?.trim() ?? null,
      function_description: a.function_description?.trim() ?? null,
      typical_use: a.typical_use?.trim() ?? null,
      food_usage: (a.food_usage ?? [])
        .filter((u) => u.food_category)
        .map((u) => ({
          food_category: u.food_category.trim(),
          usage_note: u.usage_note?.trim() || null,
          example_products: u.example_products?.trim() || null,
        })),
      risk: {
        level: a.risk.level,
        confidence: a.risk.confidence,
        reasoning: a.risk.reasoning.trim(),
      },
      studies,
    });
  }
}

mkdirSync(dirname(cachePath), { recursive: true });
writeFileSync(cachePath, JSON.stringify(cache, null, 1));

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} erreur(s) : rien n'a été écrit.`);
  process.exit(1);
}

additives.sort((x, y) => x.e_number.localeCompare(y.e_number, "fr", { numeric: true }));
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(additives, null, 2) + "\n");

const levels = { blue: 0, yellow: 0, red: 0 };
for (const a of additives) levels[a.risk.level] += 1;
const kept = additives.reduce((n, a) => n + a.studies.length, 0);
console.error(`${additives.length} additifs → ${outPath}`);
console.error(`Niveaux : ${JSON.stringify(levels)}`);
console.error(`Sources gardées : ${kept}, rejetées : ${rejectedStudies.length}`);
writeFileSync(resolve(root, ".context/rejected-studies.json"), JSON.stringify(rejectedStudies, null, 1));
