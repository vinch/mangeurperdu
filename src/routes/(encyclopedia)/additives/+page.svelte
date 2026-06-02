<script lang="ts">
  import { navigating } from "$app/state";
  import CategoryBadge from "$lib/components/additives/CategoryBadge.svelte";
  import RiskBadge from "$lib/components/additives/RiskBadge.svelte";
  import type { AdditivesListingPageData } from "$lib/types/additives";

  let { data }: { data: AdditivesListingPageData } = $props();

  const isLoading = $derived(Boolean(navigating.to));
</script>

<svelte:head>
  <title>Encyclopédie des additifs alimentaires — Mangeur Perdu</title>
  <meta
    name="description"
    content="Références, catégories et évaluations éditoriales des additifs alimentaires (numéros E)."
  />
</svelte:head>

<div>
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title">Encyclopédie des additifs alimentaires</h1>
    <p class="hero-subtitle">
      Une base de référence pour comprendre les additifs que l’on croise sur les
      étiquettes : numéros E, noms, usages et synthèse des sources disponibles.
      Les évaluations présentées ici sont éditoriales et évolutives.
    </p>
  </section>

  <form class="ency-filters" method="GET" action="/additives">
      <label class="search-field">
        <span class="label-text">Rechercher</span>
        <input
          type="search"
          name="q"
          value={data.search}
          placeholder="Numéro E, nom, catégorie…"
          autocomplete="off"
        />
      </label>

      <label class="category-field">
        <span class="label-text">Catégorie</span>
        <select name="category" value={data.category}>
          <option value="">Toutes les catégories</option>
          {#each data.categories as cat (cat)}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </label>

      <div class="filter-actions">
        <button type="submit" class="btn-dark-sm">Filtrer</button>
        {#if data.search || data.category}
          <a class="filter-reset" href="/additives">Réinitialiser</a>
        {/if}
      </div>
    </form>

    {#if isLoading}
      <p class="state state-loading" role="status">Chargement…</p>
    {/if}

    {#if data.loadError}
      <p class="state state-error">{data.loadError}</p>
    {:else if data.items.length === 0}
      <p class="state state-empty">
        {#if data.search || data.category}
          Aucun additif ne correspond à votre recherche.
        {:else}
          Aucun additif publié pour le moment.
        {/if}
      </p>
    {:else}
      <ul class="additive-list">
        {#each data.items as item (item.id)}
          <li>
            <a class="additive-card" href="/additives/{item.e_number}">
              <div class="card-top">
                <span class="e-number">{item.e_number}</span>
                <CategoryBadge category={item.category} />
              </div>
              <span class="reference-name">{item.reference_name}</span>
              {#if item.risk_level}
                <div class="card-risk">
                  <RiskBadge level={item.risk_level} />
                </div>
              {/if}
              <span class="card-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
</div>

<style>
  /* Même en-tête que la page "Huiles & graisses". */
  .hero {
    padding: 0 0 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: #555;
    margin: 0 0 1rem;
    line-height: 1.55;
  }

  .ency-filters {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.75rem 1rem;
    align-items: end;
    margin-bottom: 1.5rem;
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
  }

  .search-field input:focus,
  .category-field select:focus {
    outline: 2px solid var(--mp-purple, #654074);
    outline-offset: 2px;
  }

  .category-field select {
    min-width: 12rem;
  }

  .filter-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
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
    display: grid;
    gap: 0.65rem;
  }

  .additive-card {
    position: relative;
    display: block;
    padding: 1rem 2.25rem 1rem 1.05rem;
    background: var(--mp-paper, #fffcf9);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-md, 14px);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease;
  }

  .additive-card:hover {
    border-color: rgba(101, 64, 116, 0.22);
  }

  .card-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.65rem;
    margin-bottom: 0.35rem;
  }

  .e-number {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--mp-purple, #654074);
    letter-spacing: 0.02em;
  }

  .reference-name {
    display: block;
    font-family: var(--mp-font-serif);
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--mp-text, #1b2430);
    margin-bottom: 0.5rem;
  }

  .card-risk {
    margin-top: 0.15rem;
  }

  .card-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    color: var(--mp-purple, #654074);
    opacity: 0.85;
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
