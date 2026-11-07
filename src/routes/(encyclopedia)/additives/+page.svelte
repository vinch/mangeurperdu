<script lang="ts">
  import { untrack } from "svelte";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import EmailLink from "$lib/components/EmailLink.svelte";
  import RiskBadge from "$lib/components/additives/RiskBadge.svelte";
  import { filterAdditives } from "$lib/additives/filter";
  import {
    categoryLabel,
    RISK_LEVELS,
    RISK_LONG_LABELS,
    RISK_SHORT_LABELS,
  } from "$lib/additives/labels";
  import type { AdditivesListingPageData, RiskLevel } from "$lib/types/additives";

  let { data }: { data: AdditivesListingPageData } = $props();

  // Pilotés par les champs ; réinitialisés depuis l'URL à chaque vraie
  // navigation (replaceState ne relance pas le load, donc pas de boucle).
  let search = $state(untrack(() => data.search));
  let category = $state(untrack(() => data.category));
  let risk = $state<RiskLevel | "">(untrack(() => data.risk));

  $effect.pre(() => {
    search = data.search;
    category = data.category;
    risk = data.risk;
  });

  const filtered = $derived(filterAdditives(data.items, { search, category, risk }));

  /** Compteurs par niveau, à recherche et catégorie constantes. */
  const riskCounts = $derived.by(() => {
    const base = filterAdditives(data.items, { search, category, risk: "" });
    const counts: Record<RiskLevel, number> = { blue: 0, yellow: 0, red: 0 };
    for (const item of base) {
      if (item.risk_level) counts[item.risk_level] += 1;
    }
    return { total: base.length, ...counts };
  });

  const hasRiskData = $derived(data.items.some((i) => i.risk_level));
  const hasFilters = $derived(Boolean(search.trim() || category || risk));

  function syncUrl() {
    const url = new URL(page.url);
    const params: [string, string][] = [
      ["q", search.trim()],
      ["category", category],
      ["risk", risk],
    ];
    for (const [key, value] of params) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    if (url.search !== page.url.search) replaceState(url, {});
  }

  function setRisk(event: MouseEvent, level: RiskLevel | "") {
    event.preventDefault();
    risk = risk === level ? "" : level;
    syncUrl();
  }

  function reset(event: MouseEvent) {
    event.preventDefault();
    search = "";
    category = "";
    risk = "";
    syncUrl();
  }
</script>

<svelte:head>
  <title>Encyclopédie des additifs alimentaires (numéros E) — Mangeur Perdu</title>
  <meta
    name="description"
    content="Les {data.items.length} additifs alimentaires autorisés en Europe (numéros E) : noms, rôle, aliments concernés et évaluation éditoriale des risques par Mangeur Perdu."
  />
</svelte:head>

<div>
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title">Encyclopédie des additifs alimentaires</h1>
    <p class="hero-subtitle">
      Les additifs que l’on croise sur les étiquettes, du E100 au E1521 : à quoi
      ils servent, où on les trouve, et ce que disent les sources disponibles.
      Les évaluations sont éditoriales et évolutives —
      <a href="#methode">voir la méthode</a>.
    </p>
  </section>

  <form
    class="ency-filters"
    method="GET"
    action="/additives"
    onsubmit={(e) => e.preventDefault()}
  >
    <label class="search-field">
      <span class="label-text">Rechercher</span>
      <input
        type="search"
        name="q"
        bind:value={search}
        oninput={syncUrl}
        placeholder="E250, aspartame, colorant…"
        autocomplete="off"
        spellcheck="false"
      />
    </label>

    <label class="category-field">
      <span class="label-text">Catégorie</span>
      <select name="category" bind:value={category} onchange={syncUrl}>
        <option value="">Toutes les catégories</option>
        {#each data.categories as cat (cat)}
          <option value={cat}>{categoryLabel(cat)}</option>
        {/each}
      </select>
    </label>

    <noscript>
      <div class="filter-actions">
        <button type="submit" class="btn-dark-sm">Filtrer</button>
      </div>
    </noscript>

    {#if hasRiskData}
      <fieldset class="risk-filter">
        <legend class="label-text">Évaluation</legend>
        <div class="risk-chips">
          <button
            type="submit"
            name="risk"
            value=""
            class="risk-chip"
            aria-pressed={risk === ""}
            onclick={(e) => setRisk(e, "")}
          >
            Tous <span class="count">{riskCounts.total}</span>
          </button>
          {#each RISK_LEVELS as level (level)}
            <button
              type="submit"
              name="risk"
              value={level}
              class="risk-chip"
              data-level={level}
              aria-pressed={risk === level}
              title={RISK_LONG_LABELS[level]}
              onclick={(e) => setRisk(e, level)}
            >
              <span class="dot" aria-hidden="true"></span>
              {RISK_SHORT_LABELS[level]}
              <span class="count">{riskCounts[level]}</span>
            </button>
          {/each}
        </div>
      </fieldset>
    {/if}
  </form>

  {#if data.loadError}
    <p class="state state-error">{data.loadError}</p>
  {:else if filtered.length === 0}
    <p class="state state-empty">
      {#if hasFilters}
        Aucun additif ne correspond à votre recherche.
        <a class="filter-reset" href="/additives" onclick={reset}>Tout afficher</a>
      {:else}
        Aucun additif publié pour le moment.
      {/if}
    </p>
  {:else}
    <p class="result-count" aria-live="polite">
      {filtered.length}
      {filtered.length > 1 ? "additifs" : "additif"}
      {#if hasFilters}
        <a class="filter-reset" href="/additives" onclick={reset}>Réinitialiser</a>
      {/if}
    </p>

    <ul class="additive-list">
      {#each filtered as item (item.id)}
        <li>
          <a class="additive-row" href="/additives/{item.e_number}">
            <span class="e-number">{item.e_number}</span>
            <span class="row-main">
              <span class="reference-name">{item.name_fr ?? item.reference_name}</span>
              <span class="row-category">{categoryLabel(item.category)}</span>
            </span>
            {#if item.risk_level}
              <span class="row-risk"><RiskBadge level={item.risk_level} compact /></span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}

  <section id="methode" class="method" aria-labelledby="method-title">
    <h2 id="method-title">Comment lire l’évaluation</h2>
    <p>
      Chaque additif reçoit l’un des trois niveaux ci-dessous, attribué selon une
      grille fixe à partir des avis de l’EFSA (Autorité européenne de sécurité
      des aliments), des classements du CIRC, du statut réglementaire européen et
      des principales études publiées.
    </p>
    <dl class="method-levels">
      <div>
        <dt><RiskBadge level="red" /></dt>
        <dd>
          Interdit ou retiré dans l’Union européenne, avertissement obligatoire sur
          l’étiquette, classement cancérogène (avéré, probable ou possible) par le
          CIRC, rôle documenté dans la formation de composés cancérogènes, ou
          préoccupation de sécurité relevée par l’EFSA.
        </dd>
      </div>
      <div>
        <dt><RiskBadge level="yellow" /></dt>
        <dd>
          Dose journalière admissible abaissée ou dépassée chez certains
          consommateurs, données insuffisantes pour conclure, études animales ou
          grandes cohortes suggérant un effet sans preuve causale chez l’humain,
          intolérances notables ou impuretés liées au procédé.
        </dd>
      </div>
      <div>
        <dt><RiskBadge level="blue" /></dt>
        <dd>
          Substance déjà présente dans l’alimentation ou l’organisme, ou réévaluée
          sans signal particulier. Cela ne veut pas dire « bon pour la santé » :
          beaucoup de ces additifs signalent surtout un aliment ultra-transformé.
        </dd>
      </div>
    </dl>
    <p class="method-note">
      Cette encyclopédie est un travail éditorial à visée informative. Elle ne
      remplace ni un avis médical, ni une expertise réglementaire. Une erreur, une
      étude manquante ?
      <EmailLink subject="Encyclopédie des additifs — correction">Écrivez-moi</EmailLink>.
    </p>
  </section>
</div>

<style>
  .hero {
    padding: 0 0 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: #555;
    margin: 0 0 1rem;
    line-height: 1.55;
  }

  .hero-subtitle a {
    color: var(--mp-purple, #654074);
  }

  .ency-filters {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.9rem 1rem;
    align-items: end;
    margin-bottom: 1.25rem;
    padding: 1rem 1.1rem;
    background: var(--mp-paper, #fffcf9);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-md, 14px);
  }

  .label-text {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
    margin-bottom: 0.35rem;
    padding: 0;
  }

  .search-field input,
  .category-field select {
    width: 100%;
    min-width: 0;
    padding: 0.55rem 0.7rem;
    font: inherit;
    font-size: 0.95rem;
    color: var(--mp-text, #1b2430);
    background: #fff;
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-sm, 10px);
    box-sizing: border-box;
    height: 2.65rem;
  }

  .search-field input:focus,
  .category-field select:focus {
    outline: 2px solid var(--mp-purple, #654074);
    outline-offset: 2px;
  }

  .category-field select {
    min-width: 13rem;
  }

  .filter-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .risk-filter {
    grid-column: 1 / -1;
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }

  .risk-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .risk-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.38rem 0.75rem;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--mp-text, #1b2430);
    background: #fff;
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.12));
    border-radius: 999px;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  .risk-chip:hover {
    border-color: rgba(27, 36, 48, 0.3);
  }

  .risk-chip[aria-pressed="true"] {
    background: var(--mp-ink, #141c26);
    border-color: var(--mp-ink, #141c26);
    color: #fff;
  }

  .risk-chip .dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
  }

  .risk-chip[data-level="blue"] .dot {
    background: #3b82f6;
  }

  .risk-chip[data-level="yellow"] .dot {
    background: #eab308;
  }

  .risk-chip[data-level="red"] .dot {
    background: #ef4444;
  }

  .count {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    opacity: 0.6;
  }

  .result-count {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
  }

  .filter-reset {
    font-size: 0.9rem;
    color: var(--mp-purple, #654074);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .state {
    margin: 0;
    padding: 1rem 0;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .state-error {
    color: #7a1f1f;
    font-weight: 600;
  }

  .additive-list {
    list-style: none;
    padding: 0;
    margin: 0;
    background: var(--mp-paper, #fffcf9);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-md, 14px);
    overflow: hidden;
  }

  .additive-list li + li {
    border-top: 1px solid var(--mp-border, rgba(27, 36, 48, 0.08));
  }

  .additive-row {
    display: grid;
    grid-template-columns: 4rem 1fr auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.15s ease;
  }

  .additive-row:hover {
    background: #fff;
  }

  .e-number {
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--mp-purple, #654074);
    letter-spacing: 0.02em;
    font-variant-numeric: tabular-nums;
  }

  .row-main {
    min-width: 0;
  }

  .reference-name {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--mp-text, #1b2430);
  }

  .row-category {
    display: block;
    font-size: 0.8rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  @media (max-width: 560px) {
    .additive-row {
      grid-template-columns: 3.9rem 1fr;
    }

    .row-risk {
      grid-column: 2;
    }
  }

  .method {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    scroll-margin-top: 5rem;
  }

  .method h2 {
    margin: 0 0 0.75rem;
    font-size: 1.35rem;
  }

  .method p {
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
    line-height: 1.65;
  }

  .method-levels {
    display: grid;
    gap: 0.9rem;
    margin: 1.25rem 0;
  }

  .method-levels dt {
    margin-bottom: 0.35rem;
  }

  .method-levels dd {
    margin: 0;
    color: var(--mp-text, #1b2430);
    line-height: 1.6;
  }

  .method-note {
    font-size: 0.92rem;
  }

  .method-note :global(a) {
    color: var(--mp-purple, #654074);
  }

  @media (max-width: 720px) {
    .ency-filters {
      grid-template-columns: 1fr;
    }

    .category-field select {
      min-width: 0;
    }
  }
</style>
