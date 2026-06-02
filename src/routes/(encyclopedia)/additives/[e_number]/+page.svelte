<script lang="ts">
  import CategoryBadge from "$lib/components/additives/CategoryBadge.svelte";
  import RiskBadge from "$lib/components/additives/RiskBadge.svelte";
  import type { AdditiveDetailPageData, AdditiveName } from "$lib/types/additives";

  let { data }: { data: AdditiveDetailPageData } = $props();

  function fmtDate(iso: string | null) {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function groupNamesByLanguage(names: AdditiveName[]) {
    const map = new Map<string, AdditiveName[]>();
    for (const n of names) {
      const lang = n.language_code || "—";
      const list = map.get(lang) ?? [];
      list.push(n);
      map.set(lang, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "fr"));
  }

  const namesByLang = $derived(groupNamesByLanguage(data.names));

  function studyLink(study: { doi: string | null; url: string | null }) {
    if (study.doi) {
      const d = study.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
      return `https://doi.org/${d}`;
    }
    return study.url;
  }
</script>

<svelte:head>
  <title>{data.additive.e_number} — {data.additive.reference_name} — Encyclopédie</title>
  <meta
    name="description"
    content="Fiche {data.additive.e_number} ({data.additive.reference_name}) : description, usages et sources."
  />
</svelte:head>

<div class="detail">
  <p class="back">
      <a href="/additives">← Retour à l’encyclopédie</a>
    </p>

    <header class="detail-header ency-card">
      <div class="detail-title-row">
        <span class="e-number">{data.additive.e_number}</span>
        <CategoryBadge category={data.additive.category} />
      </div>
      <h1>{data.additive.reference_name}</h1>
    </header>

    {#if data.loadError}
      <p class="state state-error">{data.loadError}</p>
    {/if}

    {#if data.additive.origin || data.additive.description || data.additive.function_description || data.additive.typical_use}
      <section class="ency-card">
        <h2>Présentation</h2>
        {#if data.additive.origin}
          <p><strong>Origine :</strong> {data.additive.origin}</p>
        {/if}
        {#if data.additive.description}
          <p>{data.additive.description}</p>
        {/if}
        {#if data.additive.function_description}
          <p>
            <strong>Fonction :</strong>
            {data.additive.function_description}
          </p>
        {/if}
        {#if data.additive.typical_use}
          <p><strong>Usages typiques :</strong> {data.additive.typical_use}</p>
        {/if}
      </section>
    {/if}

    {#if data.risk}
      <section class="ency-card risk-section">
        <h2>Évaluation du risque</h2>
        <div class="risk-badge-wrap">
          <RiskBadge level={data.risk.risk_level} />
        </div>
        {#if data.risk.score != null}
          <p class="risk-meta">Score éditorial : {data.risk.score}</p>
        {/if}
        {#if data.risk.confidence_level}
          <p class="risk-meta">
            Niveau de confiance : {data.risk.confidence_level}
          </p>
        {/if}
        {#if data.risk.last_reviewed_at}
          <p class="risk-meta">
            Dernière revue : {fmtDate(data.risk.last_reviewed_at)}
          </p>
        {/if}
        {#if data.risk.reasoning}
          <p class="risk-reasoning">{data.risk.reasoning}</p>
        {/if}
        <p class="disclaimer">
          Évaluation éditoriale basée sur les sources disponibles. Ce classement
          ne remplace pas une expertise scientifique ou médicale.
        </p>
      </section>
    {/if}

    {#if data.names.length > 0}
      <section class="ency-card">
        <h2>Noms alternatifs</h2>
        {#each namesByLang as [lang, names] (lang)}
          <div class="name-group">
            <h3>{lang}</h3>
            <ul class="name-list">
              {#each names as n (n.id)}
                <li>
                  <span class="name-text">{n.name}</span>
                  {#if n.name_type}
                    <span class="name-type">{n.name_type}</span>
                  {/if}
                  {#if n.is_preferred}
                    <span class="name-preferred">préféré</span>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </section>
    {/if}

    {#if data.foodUsage.length > 0}
      <section class="ency-card">
        <h2>Usages alimentaires</h2>
        <ul class="usage-list">
          {#each data.foodUsage as usage (usage.id)}
            <li class="usage-item">
              <h3>{usage.food_category}</h3>
              {#if usage.usage_note}
                <p>{usage.usage_note}</p>
              {/if}
              {#if usage.example_products}
                <p class="examples">
                  <strong>Exemples :</strong>
                  {usage.example_products}
                </p>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if data.studies.length > 0}
      <section class="ency-card">
        <h2>Études et sources</h2>
        <ul class="study-list">
          {#each data.studies as study (study.id)}
            <li class="study-item">
              <h3>{study.title}</h3>
              <dl class="study-meta">
                {#if study.authors}
                  <div>
                    <dt>Auteurs</dt>
                    <dd>{study.authors}</dd>
                  </div>
                {/if}
                {#if study.year}
                  <div>
                    <dt>Année</dt>
                    <dd>{study.year}</dd>
                  </div>
                {/if}
                {#if study.journal}
                  <div>
                    <dt>Journal</dt>
                    <dd>{study.journal}</dd>
                  </div>
                {/if}
                {#if study.source_type}
                  <div>
                    <dt>Type de source</dt>
                    <dd>{study.source_type}</dd>
                  </div>
                {/if}
                {#if study.study_type}
                  <div>
                    <dt>Type d’étude</dt>
                    <dd>{study.study_type}</dd>
                  </div>
                {/if}
                {#if study.evidence_strength}
                  <div>
                    <dt>Force de preuve</dt>
                    <dd>{study.evidence_strength}</dd>
                  </div>
                {/if}
                {#if study.severity_level}
                  <div>
                    <dt>Niveau de gravité</dt>
                    <dd>{study.severity_level}</dd>
                  </div>
                {/if}
              </dl>
              {#if study.summary}
                <p>{study.summary}</p>
              {/if}
              {#if study.health_effect_summary}
                <p>
                  <strong>Effets sur la santé :</strong>
                  {study.health_effect_summary}
                </p>
              {/if}
              {#if study.conclusion_summary}
                <p>
                  <strong>Conclusion :</strong>
                  {study.conclusion_summary}
                </p>
              {/if}
              {#if studyLink(study)}
                <p>
                  <a
                    href={studyLink(study)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {study.doi ? "Voir le DOI" : "Voir la source"}
                  </a>
                </p>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
</div>

<style>
  .back {
    margin: 0 0 1rem;
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

  .ency-card {
    background: var(--mp-paper, #fffcf9);
    border: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    border-radius: var(--mp-radius-md, 14px);
    padding: 1.15rem 1.2rem;
    margin-bottom: 1rem;
  }

  .ency-card h2 {
    margin: 0 0 0.75rem;
    font-family: var(--mp-font-serif);
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--mp-text, #1b2430);
  }

  .ency-card h3 {
    margin: 0.75rem 0 0.4rem;
    font-size: 1rem;
    font-weight: 650;
    color: var(--mp-text, #1b2430);
  }

  .ency-card p {
    margin: 0 0 0.75rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
    line-height: 1.65;
  }

  .ency-card p:last-child {
    margin-bottom: 0;
  }

  .detail-header {
    margin-bottom: 1rem;
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
    font-size: 0.95rem;
    color: var(--mp-purple, #654074);
    letter-spacing: 0.02em;
  }

  .detail-header h1 {
    margin: 0;
    font-family: var(--mp-font-serif);
    font-size: clamp(1.65rem, 3vw, 2.1rem);
    font-weight: 600;
    line-height: 1.15;
    color: var(--mp-text, #1b2430);
  }

  .risk-badge-wrap {
    margin-bottom: 0.65rem;
  }

  .risk-meta {
    font-size: 0.9rem;
  }

  .risk-reasoning {
    margin-top: 0.5rem;
  }

  .disclaimer {
    margin-top: 1rem !important;
    padding-top: 0.85rem;
    border-top: 1px solid var(--mp-border, rgba(27, 36, 48, 0.1));
    font-size: 0.88rem;
    font-style: italic;
  }

  .name-group + .name-group {
    margin-top: 0.85rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--mp-border, rgba(27, 36, 48, 0.08));
  }

  .name-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .name-list li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35rem 0.5rem;
    padding: 0.35rem 0;
  }

  .name-text {
    font-weight: 600;
    color: var(--mp-text, #1b2430);
  }

  .name-type,
  .name-preferred {
    font-size: 0.8rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .name-preferred {
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  .usage-list,
  .study-list {
    list-style: none;
    padding: 0;
    margin: 0;
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

  .usage-item h3,
  .study-item h3 {
    margin: 0 0 0.35rem;
    font-size: 1.05rem;
  }

  .examples {
    font-size: 0.92rem;
  }

  .study-meta {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 0.35rem 1rem;
    margin: 0 0 0.65rem;
  }

  .study-meta dt {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .study-meta dd {
    margin: 0 0 0.35rem;
    font-size: 0.9rem;
    color: var(--mp-text, #1b2430);
  }

  .study-item a {
    color: var(--mp-purple, #654074);
    font-weight: 500;
  }

  .state-error {
    color: #7a1f1f;
    font-weight: 600;
    margin-bottom: 1rem;
  }
</style>
