<script lang="ts">
  import CategoryBadge from "$lib/components/additives/CategoryBadge.svelte";
  import RiskBadge from "$lib/components/additives/RiskBadge.svelte";
  import { categoryLabel, languageLabel, originLabel } from "$lib/additives/labels";
  import type { AdditiveDetailPageData, AdditiveStudy } from "$lib/types/additives";

  let { data }: { data: AdditiveDetailPageData } = $props();

  const additive = $derived(data.additive);
  const title = $derived(additive.name_fr ?? additive.reference_name);
  const origin = $derived(originLabel(additive.origin));

  /** Synonymes, sans répéter le nom affiché en titre. */
  const otherNames = $derived(
    data.names.filter((n) => n.name.toLowerCase() !== title.toLowerCase()),
  );

  const byENumber = (a: { e_number: string }, b: { e_number: string }) =>
    a.e_number.localeCompare(b.e_number, "fr", { numeric: true });

  /** Les 12 additifs de la même catégorie les plus proches par numéro. */
  const related = $derived.by(() => {
    const order = [...data.related.map((i) => i.e_number), additive.e_number].sort(
      (a, b) => a.localeCompare(b, "fr", { numeric: true }),
    );
    const position = (e: string) => order.indexOf(e);
    const current = position(additive.e_number);
    return [...data.related]
      .sort(
        (a, b) =>
          Math.abs(position(a.e_number) - current) -
          Math.abs(position(b.e_number) - current),
      )
      .slice(0, 12)
      .sort(byENumber);
  });

  const hasPresentation = $derived(
    Boolean(
      additive.description ||
        additive.function_description ||
        additive.typical_use ||
        origin,
    ),
  );

  function fmtDate(iso: string | null) {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
  }

  function studyLink(study: AdditiveStudy) {
    if (study.doi) {
      const d = study.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
      return `https://doi.org/${d}`;
    }
    return study.url;
  }

  function studyMeta(study: AdditiveStudy) {
    return [study.authors, study.journal, study.year, study.study_type]
      .filter(Boolean)
      .join(" · ");
  }

  const metaDescription = $derived(
    [
      `${additive.e_number} (${title}) : ${categoryLabel(additive.category).toLowerCase()}.`,
      additive.function_description,
      data.risk ? "Évaluation des risques et sources." : null,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 300),
  );
</script>

<svelte:head>
  <title>{additive.e_number} {title} — additif alimentaire — Mangeur Perdu</title>
  <meta name="description" content={metaDescription} />
</svelte:head>

<div class="detail">
  <p class="back">
    <a href="/additives">← Toute l’encyclopédie</a>
  </p>

  <header class="detail-header">
    <div class="detail-title-row">
      <span class="e-number">{additive.e_number}</span>
      <CategoryBadge category={additive.category} />
    </div>
    <h1>{title}</h1>
    {#if additive.name_fr && additive.name_fr.toLowerCase() !== additive.reference_name.toLowerCase()}
      <p class="subtitle" lang="en">{additive.reference_name}</p>
    {/if}
    {#if data.risk}
      <div class="header-risk">
        <RiskBadge level={data.risk.risk_level} />
      </div>
    {/if}
  </header>

  {#if data.loadError}
    <p class="state state-error">{data.loadError}</p>
  {/if}

  {#if hasPresentation}
    <section class="ency-card">
      <h2>En bref</h2>
      {#if additive.description}
        <p>{additive.description}</p>
      {/if}
      <dl class="facts">
        {#if additive.function_description}
          <div>
            <dt>Rôle</dt>
            <dd>{additive.function_description}</dd>
          </div>
        {/if}
        {#if additive.typical_use}
          <div>
            <dt>Où on le trouve</dt>
            <dd>{additive.typical_use}</dd>
          </div>
        {/if}
        {#if origin}
          <div>
            <dt>Origine</dt>
            <dd>{origin}</dd>
          </div>
        {/if}
      </dl>
    </section>
  {/if}

  {#if data.risk}
    <section class="ency-card risk-card" data-level={data.risk.risk_level}>
      <h2>Évaluation Mangeur Perdu</h2>
      {#if data.risk.reasoning}
        <p class="risk-reasoning">{data.risk.reasoning}</p>
      {/if}
      <p class="risk-meta">
        {#if data.risk.confidence_level}
          <span>Confiance : {data.risk.confidence_level}</span>
        {/if}
        {#if fmtDate(data.risk.last_reviewed_at)}
          <span>Revue : {fmtDate(data.risk.last_reviewed_at)}</span>
        {/if}
        <a href="/additives#methode">Comment lire l’évaluation</a>
      </p>
    </section>
  {:else}
    <section class="ency-card">
      <h2>Évaluation Mangeur Perdu</h2>
      <p>Cet additif n’a pas encore été évalué.</p>
    </section>
  {/if}

  {#if data.foodUsage.length > 0}
    <section class="ency-card">
      <h2>Aliments concernés</h2>
      <ul class="usage-list">
        {#each data.foodUsage as usage (usage.id)}
          <li class="usage-item">
            <h3>{usage.food_category}</h3>
            {#if usage.usage_note}
              <p>{usage.usage_note}</p>
            {/if}
            {#if usage.example_products}
              <p class="examples">Ex. : {usage.example_products}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if otherNames.length > 0}
    <section class="ency-card">
      <h2>Autres noms</h2>
      <ul class="name-list">
        {#each otherNames as n (n.id)}
          <li>
            <span class="name-text" lang={n.language_code}>{n.name}</span>
            <span class="name-type">
              {n.name_type ?? languageLabel(n.language_code)}
            </span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if data.studies.length > 0}
    <section class="ency-card">
      <h2>Sources</h2>
      <ul class="study-list">
        {#each data.studies as study (study.id)}
          {@const link = studyLink(study)}
          <li class="study-item">
            <h3>
              {#if link}
                <a href={link} target="_blank" rel="noopener noreferrer">{study.title}</a>
              {:else}
                {study.title}
              {/if}
            </h3>
            {#if studyMeta(study)}
              <p class="study-meta">{studyMeta(study)}</p>
            {/if}
            {#if study.summary}
              <p>{study.summary}</p>
            {/if}
            {#if study.health_effect_summary}
              <p>{study.health_effect_summary}</p>
            {/if}
            {#if study.conclusion_summary}
              <p>{study.conclusion_summary}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if related.length > 0}
    <section class="related">
      <h2>Dans la même catégorie : {categoryLabel(additive.category).toLowerCase()}</h2>
      <ul class="related-list">
        {#each related as item (item.id)}
          <li>
            <a href="/additives/{item.e_number}" data-level={item.risk_level}>
              <span class="related-e">{item.e_number}</span>
              {item.name_fr ?? item.reference_name}
            </a>
          </li>
        {/each}
      </ul>
      <p class="related-all">
        <a href="/additives?category={additive.category}">
          Voir toute la catégorie →
        </a>
      </p>
    </section>
  {/if}
</div>

<style>
  .back {
    margin: 0 0 1.25rem;
  }

  .back a {
    font-size: 0.9rem;
    color: var(--mp-purple, #654074);
    text-decoration: none;
    font-weight: 500;
  }

  .back a:hover {
    text-decoration: underline;
  }

  .detail-header {
    margin-bottom: 1.5rem;
  }

  .detail-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.65rem;
    margin-bottom: 0.5rem;
  }

  .e-number {
    font-weight: 700;
    font-size: 1rem;
    color: var(--mp-purple, #654074);
    letter-spacing: 0.02em;
  }

  .detail-header h1 {
    margin: 0;
    font-family: var(--mp-font-serif);
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 650;
    line-height: 1.1;
    color: var(--mp-text, #1b2430);
  }

  .subtitle {
    margin: 0.35rem 0 0;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
    font-size: 0.95rem;
  }

  .header-risk {
    margin-top: 0.9rem;
  }

  .ency-card {
    background: var(--mp-paper, #fffcf9);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-md, 14px);
    padding: 1.15rem 1.2rem;
    margin-bottom: 1rem;
  }

  .ency-card h2,
  .related h2 {
    margin: 0 0 0.75rem;
    font-family: var(--mp-font-serif);
    font-size: 1.25rem;
    font-weight: 650;
    color: var(--mp-text, #1b2430);
  }

  .ency-card h3 {
    margin: 0 0 0.3rem;
    font-size: 1rem;
    font-weight: 650;
    color: var(--mp-text, #1b2430);
  }

  .ency-card p {
    margin: 0 0 0.75rem;
    color: var(--mp-text, #1b2430);
    line-height: 1.65;
  }

  .ency-card p:last-child {
    margin-bottom: 0;
  }

  .facts {
    display: grid;
    gap: 0.6rem;
    margin: 0.9rem 0 0;
  }

  .facts dt {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .facts dd {
    margin: 0.1rem 0 0;
    line-height: 1.55;
  }

  .risk-card {
    border-left-width: 4px;
  }

  .risk-card[data-level="blue"] {
    border-left-color: #3b82f6;
  }

  .risk-card[data-level="yellow"] {
    border-left-color: #eab308;
  }

  .risk-card[data-level="red"] {
    border-left-color: #ef4444;
  }

  .risk-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1.1rem;
    font-size: 0.85rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66)) !important;
  }

  .risk-meta a {
    color: var(--mp-purple, #654074);
  }

  .usage-list,
  .study-list,
  .name-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .usage-list,
  .study-list {
    display: grid;
    gap: 0.85rem;
  }

  .usage-item,
  .study-item {
    padding-top: 0.85rem;
    border-top: 1px solid var(--mp-border, rgba(27, 36, 48, 0.08));
  }

  .usage-item:first-child,
  .study-item:first-child {
    padding-top: 0;
    border-top: none;
  }

  .usage-item p,
  .study-item p {
    margin-bottom: 0.3rem;
  }

  .examples {
    font-size: 0.92rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66)) !important;
  }

  .name-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .name-list li {
    display: inline-flex;
    align-items: baseline;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    background: #fff;
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: 8px;
  }

  .name-text {
    font-weight: 600;
    color: var(--mp-text, #1b2430);
  }

  .name-type {
    font-size: 0.78rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .study-item h3 a {
    color: var(--mp-text, #1b2430);
    text-decoration: underline;
    text-decoration-color: var(--mp-link-underline, rgba(101, 64, 116, 0.32));
    text-underline-offset: 3px;
  }

  .study-item h3 a:hover {
    color: var(--mp-purple, #654074);
  }

  .study-meta {
    font-size: 0.85rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66)) !important;
  }

  .related {
    margin-top: 2rem;
  }

  .related-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .related-list a {
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    padding: 0.35rem 0.7rem;
    font-size: 0.88rem;
    color: var(--mp-text, #1b2430);
    text-decoration: none;
    background: var(--mp-paper, #fff);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-left: 3px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: 8px;
  }

  .related-list a:hover {
    border-color: rgba(101, 64, 116, 0.3);
  }

  .related-list a[data-level="blue"] {
    border-left-color: #3b82f6;
  }

  .related-list a[data-level="yellow"] {
    border-left-color: #eab308;
  }

  .related-list a[data-level="red"] {
    border-left-color: #ef4444;
  }

  .related-e {
    font-weight: 700;
    color: var(--mp-purple, #654074);
  }

  .related-all a {
    font-size: 0.9rem;
    color: var(--mp-purple, #654074);
  }

  .state-error {
    color: #7a1f1f;
    font-weight: 600;
    margin-bottom: 1rem;
  }
</style>
