<script lang="ts">
  import {
    WEIGHTINGS_BY_USAGE,
    DETAIL_BY_USAGE,
    OILS_TO_AVOID,
    FAQ,
    CRITERIA_DOCUMENTATION,
    isVegan,
  } from "./data";
  import type { UsageId, OilDetail } from "./data";

  let tocOpen = $state(false);
  let activeTab = $state<UsageId>("cru");
  let expandedOilIndex = $state<number | null>(null);
  let expandedFaqIndex = $state<number | null>(null);
  let expandedCriteriaDocIndex = $state<number | null>(null);
  let showBackToTop = $state(false);

  $effect(() => {
    const onScroll = () => {
      showBackToTop = typeof window !== "undefined" && window.scrollY > 300;
    };
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleOil(index: number) {
    expandedOilIndex = expandedOilIndex === index ? null : index;
  }
  function toggleFaq(index: number) {
    expandedFaqIndex = expandedFaqIndex === index ? null : index;
  }
  function toggleCriteriaDoc(index: number) {
    expandedCriteriaDocIndex =
      expandedCriteriaDocIndex === index ? null : index;
  }

  const USAGE_LABELS: Record<UsageId, string> = {
    cru: "À cru",
    douce: "Cuisson douce (≤ 160 °C)",
    haute: "Cuisson haute (> 160 °C)",
  };

  /** Tableau détaillé trié par score décroissant (total = somme des contributions si critères), puis par nom à score égal ; N/A en fin. */
  function sortOilsForTable(oils: OilDetail[]): OilDetail[] {
    return [...oils].sort((a, b) => {
      const ta = displayTotal(a);
      const tb = displayTotal(b);
      if (ta == null && tb == null) return a.name.localeCompare(b.name);
      if (ta == null) return 1;
      if (tb == null) return -1;
      const byScore = tb - ta;
      return byScore !== 0 ? byScore : a.name.localeCompare(b.name);
    });
  }

  /** Total affiché : somme des contributions si critères présents, sinon total (pour cohérence exacte). */
  function displayTotal(oil: OilDetail): number | null {
    if (oil.criteria.length > 0)
      return oil.criteria.reduce((s, c) => s + c.contribution, 0);
    return oil.total;
  }

  /** Rangs pour un tableau trié : même score = même rang, N/A = "–". Utilise le total affiché (somme des contributions). */
  function getRanks(oils: OilDetail[]): (number | string)[] {
    const ranks: (number | string)[] = [];
    let rank = 0;
    for (let i = 0; i < oils.length; i++) {
      const t = displayTotal(oils[i]);
      if (t == null) {
        ranks.push("–");
      } else {
        if (i === 0 || displayTotal(oils[i - 1]) !== t) rank = i + 1;
        ranks.push(rank);
      }
    }
    return ranks;
  }

  /** Top 5 par usage : dérivé du même tri que les tableaux détaillés (sortOilsForTable), sans duplication. */
  function getTop5(
    usageId: UsageId
  ): Array<{ name: string; scoreFinal: number }> {
    const sorted = sortOilsForTable(DETAIL_BY_USAGE[usageId]);
    return sorted
      .filter((o) => displayTotal(o) != null)
      .slice(0, 5)
      .map((o) => ({ name: o.name, scoreFinal: displayTotal(o)! }));
  }

  /** Critères triés dans l'ordre des pondérations (décroissant) pour l'usage donné. */
  function criteriaByWeightOrder<T extends { criterion: string }>(
    criteria: T[],
    usageId: UsageId
  ): T[] {
    const order = WEIGHTINGS_BY_USAGE[usageId];
    return [...criteria].sort(
      (a, b) =>
        order.findIndex((r) => r.criterion === a.criterion) -
        order.findIndex((r) => r.criterion === b.criterion)
    );
  }
</script>

<svelte:head>
  <title>Méthode de classement des huiles et graisses — Mangeur Perdu</title>
  <meta
    name="description"
    content="Méthode de classement des huiles et graisses par usage : cru, cuisson douce, cuisson haute. Scores, pondérations et tableaux détaillés."
  />
  <meta
    property="og:title"
    content="Méthode de classement des huiles et graisses — Mangeur Perdu"
  />
  <meta
    property="og:description"
    content="Méthode de classement des huiles et graisses par usage : cru, cuisson douce, cuisson haute."
  />
</svelte:head>

<div class="fat-page">
  <header class="fat-header">
    <a href="/" class="back-link">← Retour à l'accueil</a>
    <span class="fat-version" aria-label="Version et date"
      >Version 1 / 16 février 2026</span
    >
  </header>

  <main>
    <!-- HERO -->
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Méthode de classement des huiles et graisses</h1>
      <p class="hero-subtitle">
        Scores, pondérations et détail des critères par usage (cru, cuisson
        douce, cuisson haute).
      </p>
    </section>

    <!-- TABLE DES MATIÈRES -->
    <nav class="toc" aria-label="Table des matières">
      <button
        type="button"
        class="toc-toggle"
        aria-expanded={tocOpen}
        aria-controls="toc-list"
        onclick={() => (tocOpen = !tocOpen)}
      >
        Table des matières
      </button>
      <ul id="toc-list" class="toc-list" class:open={tocOpen}>
        <li><a href="#resultats-title">Résultats</a></li>
        <li><a href="#methode">Méthode</a></li>
        <li><a href="#ponderations">Pondérations</a></li>
        <li><a href="#details">Tableaux détaillés</a></li>
        <li><a href="#eviter">Huiles à éviter</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#limites">Limites</a></li>
      </ul>
    </nav>

    <!-- RÉSULTATS -->
    <section class="results-section" aria-labelledby="resultats-title">
      <h2 id="resultats-title">Résultats</h2>

      <div class="result-cards">
        <article class="result-card" id="cru">
          <h3>À cru</h3>
          <ol class="result-list">
            {#each getTop5("cru") as item}
              <li>
                {item.name}
                {#if isVegan(item.name)}
                  <span
                    class="vegan-icon"
                    title="Végétal"
                    role="img"
                    aria-label="Végétal">🌱</span
                  >
                {/if}
                — {item.scoreFinal}
              </li>
            {/each}
          </ol>
          <p class="card-links">
            <a href="#methode">Voir la méthode</a> ·
            <a href="#details">Voir les tableaux détaillés</a>
          </p>
        </article>

        <article class="result-card" id="douce">
          <h3>Cuisson douce (≤ 160 °C)</h3>
          <ol class="result-list">
            {#each getTop5("douce") as item}
              <li>
                {item.name}
                {#if isVegan(item.name)}
                  <span
                    class="vegan-icon"
                    title="Végétal"
                    role="img"
                    aria-label="Végétal">🌱</span
                  >
                {/if}
                — {item.scoreFinal}
              </li>
            {/each}
          </ol>
          <p class="card-links">
            <a href="#methode">Voir la méthode</a> ·
            <a href="#details">Voir les tableaux détaillés</a>
          </p>
        </article>

        <article class="result-card" id="haute">
          <h3>Cuisson haute (> 160 °C)</h3>
          <ol class="result-list">
            {#each getTop5("haute") as item}
              <li>
                {item.name}
                {#if isVegan(item.name)}
                  <span
                    class="vegan-icon"
                    title="Végétal"
                    role="img"
                    aria-label="Végétal">🌱</span
                  >
                {/if}
                — {item.scoreFinal}
              </li>
            {/each}
          </ol>
          <p class="card-links">
            <a href="#methode">Voir la méthode</a> ·
            <a href="#details">Voir les tableaux détaillés</a>
          </p>
        </article>
      </div>
      <p class="legend">
        <span class="vegan-icon">🌱</span> = végétal (non animal)
      </p>
    </section>

    <!-- EXPLICATION MÉTHODE -->
    <section class="text-section" id="methode" aria-labelledby="methode-title">
      <h2 id="methode-title">Méthode</h2>
      <div class="prose">
        <p>
          Chaque critère est noté sur 5 selon des grilles explicites (voir
          ci‑dessous). Chaque critère a un poids selon l'usage (cru, cuisson
          douce, cuisson haute). Les scores sur 100 sont la somme des
          contributions (note/5 × poids) pour chaque critère.
        </p>
        <p>
          Les notes (0/5 à 5/5) pour chaque critère sont attribuées selon des
          grilles explicites à partir des données de composition (acides gras,
          stabilité, raffinage, point de fumée, ancienneté d'usage). Vous pouvez
          consulter le détail ci‑dessous.
        </p>

        <h3 id="criteres-notes">
          Comprendre les notes (0/5 à 5/5) par critère
        </h3>
        <dl class="criteria-doc-list">
          {#each CRITERIA_DOCUMENTATION as doc, i}
            <div class="criteria-doc-item">
              <dt>
                <button
                  type="button"
                  class="faq-question-btn"
                  aria-expanded={expandedCriteriaDocIndex === i}
                  aria-controls="criteria-doc-{i}"
                  id="criteria-doc-btn-{i}"
                  onclick={() => toggleCriteriaDoc(i)}
                >
                  <span class="faq-question-text">{doc.criterion}</span>
                  <span class="expand-icon" aria-hidden="true"
                    >{expandedCriteriaDocIndex === i ? "−" : "+"}</span
                  >
                </button>
              </dt>
              {#if expandedCriteriaDocIndex === i}
                <dd id="criteria-doc-{i}" class="criteria-doc-content">
                  <p>{doc.description}</p>
                  <table class="criteria-scale-table">
                    <thead>
                      <tr>
                        <th scope="col">Note</th>
                        <th scope="col">Signification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each doc.scale as { note, label }}
                        <tr>
                          <td>{note}/5</td>
                          <td>{label}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </dd>
              {/if}
            </div>
          {/each}
        </dl>
      </div>
    </section>

    <!-- PONDÉRATIONS -->
    <section
      class="tables-section"
      id="ponderations"
      aria-labelledby="ponderations-title"
    >
      <h2 id="ponderations-title">Pondérations par usage</h2>

      <div class="weighting-tables">
        <div class="weighting-block">
          <h3>À cru</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Critère</th>
                <th scope="col">Pondération</th>
              </tr>
            </thead>
            <tbody>
              {#each WEIGHTINGS_BY_USAGE.cru as row}
                <tr>
                  <td>{row.criterion}</td>
                  <td>{row.weight}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="weighting-block">
          <h3>Cuisson douce</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Critère</th>
                <th scope="col">Pondération</th>
              </tr>
            </thead>
            <tbody>
              {#each WEIGHTINGS_BY_USAGE.douce as row}
                <tr>
                  <td>{row.criterion}</td>
                  <td>{row.weight}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="weighting-block">
          <h3>Cuisson haute</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Critère</th>
                <th scope="col">Pondération</th>
              </tr>
            </thead>
            <tbody>
              {#each WEIGHTINGS_BY_USAGE.haute as row}
                <tr>
                  <td>{row.criterion}</td>
                  <td>{row.weight}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TABLEAUX DÉTAILLÉS -->
    <section
      class="details-section"
      id="details"
      aria-labelledby="details-title"
    >
      <h2 id="details-title">Tableaux détaillés</h2>

      <div class="tabs" role="tablist" aria-label="Choix de l'usage">
        {#each ["cru", "douce", "haute"] as usageId}
          {@const id = usageId as UsageId}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls="panel-{id}"
            id="tab-{id}"
            class:active={activeTab === id}
            onclick={() => {
              activeTab = id;
              expandedOilIndex = null;
            }}
          >
            {USAGE_LABELS[id]}
          </button>
        {/each}
      </div>

      {#each ["cru", "douce", "haute"] as usageId}
        {@const id = usageId as UsageId}
        {@const oils = sortOilsForTable(DETAIL_BY_USAGE[id])}
        {@const ranks = getRanks(oils)}
        <div
          role="tabpanel"
          id="panel-{id}"
          aria-labelledby="tab-{id}"
          class="tabpanel"
          class:visible={activeTab === id}
          hidden={activeTab !== id}
        >
          <table class="detail-table">
            <caption>Toutes les graisses — {USAGE_LABELS[id]}</caption>
            <thead>
              <tr>
                <th scope="col">Rang</th>
                <th scope="col">Huile ou graisse</th>
                <th scope="col">Total /100</th>
              </tr>
            </thead>
            <tbody>
              {#each oils as oil, i}
                <tr
                  class="main-row"
                  role="button"
                  tabindex="0"
                  aria-expanded={expandedOilIndex === i}
                  aria-controls="detail-{id}-{i}"
                  id="row-{id}-{i}"
                  onclick={() => toggleOil(i)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleOil(i);
                    }
                  }}
                >
                  <td class="cell-rank">{ranks[i]}</td>
                  <td class="cell-name">
                    {oil.name}
                    {#if isVegan(oil.name)}
                      <span
                        class="vegan-icon"
                        title="Végétal"
                        role="img"
                        aria-label="Végétal">🌱</span
                      >
                    {/if}
                  </td>
                  <td class="cell-total">
                    {displayTotal(oil) ?? "N/A"}
                    <span class="expand-icon" aria-hidden="true"
                      >{expandedOilIndex === i ? "−" : "+"}</span
                    >
                  </td>
                </tr>
                {#if expandedOilIndex === i}
                  <tr class="detail-row" id="detail-{id}-{i}">
                    <td colspan="3" class="detail-cell">
                      {#if oil.criteria.length > 0}
                        <table class="criteria-inline">
                          <caption>Détail par critère</caption>
                          <thead>
                            <tr>
                              <th scope="col">Critère</th>
                              <th scope="col">Note /5</th>
                              <th scope="col">Poids</th>
                              <th scope="col">Contribution</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each criteriaByWeightOrder(oil.criteria, id) as row}
                              <tr>
                                <td>{row.criterion}</td>
                                <td>{row.note5}/5</td>
                                <td>{row.weight}</td>
                                <td>{row.contribution}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                        <p class="detail-total">
                          Total : {displayTotal(oil) != null
                            ? `${displayTotal(oil)}/100`
                            : "N/A"}
                        </p>
                      {:else}
                        <p class="detail-total">
                          Total : {displayTotal(oil) != null
                            ? `${displayTotal(oil)}/100`
                            : "N/A"}
                          (détail par critère non fourni)
                        </p>
                      {/if}
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      {/each}
      <p class="legend">
        <span class="vegan-icon">🌱</span> = végétal (non animal)
      </p>
    </section>

    <!-- HUILES À ÉVITER -->
    <section class="eviter-section" id="eviter" aria-labelledby="eviter-title">
      <h2 id="eviter-title">Huiles à éviter (quel que soit l'usage)</h2>
      <ul>
        {#each OILS_TO_AVOID as name}
          <li>{name}</li>
        {/each}
      </ul>
      <div class="prose">
        <p>Ces huiles présentent généralement :</p>
        <ul>
          <li>une teneur élevée en acides gras polyinsaturés oméga-6,</li>
          <li>une stabilité oxydative plus faible à la chaleur,</li>
          <li>un recours fréquent au raffinage,</li>
          <li>
            et un usage alimentaire historiquement récent à grande échelle.
          </li>
        </ul>
        <p>
          Dans le cadre de ce modèle, qui valorise la stabilité thermique et
          l'équilibre lipidique, elles obtiennent des scores systématiquement
          bas, quelle que soit la situation (cru, cuisson douce ou haute).
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">FAQ</h2>

      <dl class="faq-list">
        {#each FAQ as faq, i}
          <div class="faq-item">
            <dt>
              <button
                type="button"
                class="faq-question-btn"
                aria-expanded={expandedFaqIndex === i}
                aria-controls="faq-answer-{i}"
                id="faq-question-{i}"
                onclick={() => toggleFaq(i)}
              >
                <span class="faq-question-text">{faq.question}</span>
                <span class="expand-icon" aria-hidden="true"
                  >{expandedFaqIndex === i ? "−" : "+"}</span
                >
              </button>
            </dt>
            {#if expandedFaqIndex === i}
              <dd id="faq-answer-{i}" class="faq-answer">{faq.answer}</dd>
            {/if}
          </div>
        {/each}
      </dl>
    </section>

    <!-- LIMITES -->
    <section
      class="limites-section"
      id="limites"
      aria-labelledby="limites-title"
    >
      <h2 id="limites-title">Limites du modèle</h2>
      <div class="limites-prose">
        <p>
          Ce modèle repose sur des choix méthodologiques assumés : sélection des
          critères, définition de seuils (Rancimat, point de fumée, ratio
          ω6/ω3), pondérations et échelles de notation. Ces choix comportent une
          part d'arbitraire, même lorsqu'ils s'appuient sur des données
          mesurables.
        </p>
        <p>
          Les scores publiés correspondent à des profils types. Les produits
          réels peuvent varier selon la variété, l'origine, le procédé
          d'extraction, le raffinage, la conservation et la fraîcheur.
        </p>
        <p>
          Les frontières entre « cru », « cuisson douce » et « cuisson haute »
          sont également conventionnelles. Elles sont utilisées ici à des fins
          comparatives et pédagogiques.
        </p>
        <p>
          Ce modèle est évolutif. Les critères, pondérations et seuils pourront
          être ajustés au fil du temps à mesure que de nouvelles données ou
          retours critiques émergent. Les versions seront documentées afin de
          garantir la transparence des modifications.
        </p>
        <p>
          Cette page a une visée informative. Elle ne constitue pas une
          recommandation nutritionnelle officielle.
        </p>
      </div>
    </section>
  </main>

  <footer class="fat-footer">
    <a
      href="https://www.instagram.com/mangeurperdu/"
      target="_blank"
      rel="noopener noreferrer"
      class="fat-footer-link"
    >
      Suivez @mangeurperdu sur Instagram
    </a>
  </footer>

  {#if showBackToTop}
    <button
      type="button"
      class="back-to-top"
      onclick={scrollToTop}
      aria-label="Retour en haut"
      title="Retour en haut"
    >
      <span aria-hidden="true">↑</span>
    </button>
  {/if}
</div>

<style>
  .fat-page {
    background: #fff;
    color: #333;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
  }

  .fat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #eee;
  }

  .fat-version {
    font-size: 0.875rem;
    color: #666;
  }

  .back-link {
    color: #654074;
    text-decoration: none;
    font-weight: 500;
  }
  .back-link:hover {
    text-decoration: underline;
  }

  main {
    max-width: 52rem;
    margin: 0 auto;
    padding: 0 1.25rem 3rem;
  }

  .hero {
    padding: 2rem 0;
  }
  .hero h1 {
    font-size: 1.75rem;
    line-height: 1.3;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1rem;
  }
  .toc {
    margin-bottom: 2rem;
    border: 1px solid #a2a9b1;
    background: #f8f9fa;
    padding: 1rem 1.25rem;
    border-radius: 2px;
    max-width: 20rem;
  }
  .toc-toggle {
    width: 100%;
    padding: 0.5rem 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid #a2a9b1;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    text-align: left;
    color: #202122;
  }
  .toc-toggle:hover {
    color: #654074;
  }
  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
  }
  .toc-list.open {
    max-height: 20rem;
  }
  .toc-list li {
    padding: 0.35rem 0;
    border-bottom: none;
    line-height: 1.4;
  }
  .toc-list li + li {
    border-top: 1px solid #e0e0e0;
  }
  .toc-list a {
    color: #654074;
    text-decoration: none;
    display: block;
  }
  .toc-list a:hover {
    text-decoration: underline;
  }

  .results-section,
  .text-section,
  .tables-section,
  .details-section,
  .eviter-section,
  .faq-section {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }

  h2 {
    font-size: 1.35rem;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }
  .result-cards {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 1rem;
  }
  .result-card {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .result-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e0e0e0;
    color: #333;
  }
  .result-list {
    margin: 0 0 0.75rem;
    padding-left: 1.5rem;
    font-size: 1.15rem;
    line-height: 1.5;
  }
  .result-list li {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .vegan-icon {
    margin-left: 0.1rem;
  }
  .legend {
    font-size: 0.85rem;
    color: #666;
    margin: 0.75rem 0 0;
  }
  .detail-table .cell-rank {
    width: 2.5rem;
    text-align: right;
    vertical-align: middle;
    color: #666;
  }
  .detail-table .cell-name {
    vertical-align: middle;
  }
  .card-links {
    font-size: 0.9rem;
    margin: 0;
    padding-top: 0.75rem;
    border-top: 1px solid #e0e0e0;
  }
  .card-links a {
    color: #654074;
    text-decoration: none;
  }
  .card-links a:hover {
    text-decoration: underline;
  }

  .prose {
    margin-top: 0.75rem;
  }
  .prose p {
    margin-bottom: 1rem;
    color: #444;
  }

  .weighting-tables {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .weighting-block h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }
  caption {
    text-align: left;
    padding: 0.5rem 0;
    font-weight: 600;
    color: #333;
  }
  thead th {
    text-align: left;
    padding: 0.5rem 0.75rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
  }
  tbody td {
    padding: 0.5rem 0.75rem;
    border: 1px solid #eee;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .tabs button {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    color: #333;
  }
  .tabs button.active {
    background: #654074;
    color: #fff;
    border-color: #654074;
  }
  .tabs button:hover:not(.active) {
    background: #e0e0e0;
    color: #222;
  }
  .tabpanel {
    margin-top: 1rem;
  }
  .tabpanel.visible {
    display: block;
  }
  .tabpanel[hidden] {
    display: none;
  }

  .detail-table .main-row {
    cursor: pointer;
  }
  .detail-table .main-row:hover {
    background: #f5f5f5;
  }
  .detail-table .main-row:focus {
    outline: 2px solid #654074;
    outline-offset: 2px;
  }
  .detail-table .cell-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .detail-table .expand-icon {
    font-size: 1.1rem;
    color: #654074;
    font-weight: bold;
  }
  .detail-table .detail-row {
    background: #f9f9f9;
  }
  .detail-table .detail-cell {
    padding: 1rem;
    border-top: none;
    vertical-align: top;
  }
  .detail-table .criteria-inline {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
  }
  .detail-table .criteria-inline caption {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .detail-table .detail-total {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
  }

  .eviter-section ul {
    margin: 0.75rem 0 1rem;
    padding-left: 1.5rem;
  }
  .eviter-section li {
    margin-bottom: 0.25rem;
  }

  .faq-list {
    margin: 1rem 0;
  }
  .faq-item {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  .faq-item:last-child {
    border-bottom: none;
  }
  .faq-item dt {
    margin: 0 0 0.35rem;
    color: #222;
  }
  .faq-question-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    padding: 0;
    font: inherit;
    font-weight: 600;
    text-align: left;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }
  .faq-question-btn:hover {
    color: #654074;
  }
  .faq-item .expand-icon {
    font-size: 1.1rem;
    color: #654074;
    font-weight: bold;
    flex-shrink: 0;
  }
  .faq-item dd.faq-answer {
    margin: 0;
    color: #444;
    padding-left: 0;
  }
  .criteria-doc-list {
    margin: 1rem 0 0;
  }
  .criteria-doc-item {
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  .criteria-doc-item dt {
    margin: 0 0 0.25rem;
  }
  .criteria-doc-content {
    margin: 0 0 1rem;
    padding-left: 0;
    color: #444;
  }
  .criteria-doc-content p {
    margin-bottom: 0.5rem;
  }
  .criteria-scale-table {
    font-size: 0.9rem;
    border-collapse: collapse;
    margin-top: 0.5rem;
  }
  .criteria-scale-table th,
  .criteria-scale-table td {
    padding: 0.5rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  .criteria-scale-table th {
    font-weight: 600;
    color: #222;
  }
  .limites-section {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }
  .limites-section h2 {
    margin-bottom: 0.75rem;
  }
  .limites-prose {
    margin: 0;
    color: #444;
  }
  .limites-prose p {
    margin: 0 0 0.75rem 0;
  }
  .limites-prose p:last-child {
    margin-bottom: 0;
  }

  .fat-footer {
    margin-top: 2.5rem;
    padding: 1.5rem 1.25rem;
    border-top: 1px solid #eee;
    text-align: center;
  }
  .fat-footer-link {
    color: #654074;
    text-decoration: none;
    font-weight: 500;
  }
  .fat-footer-link:hover {
    text-decoration: underline;
  }

  @media (min-width: 640px) {
    .hero h1 {
      font-size: 2rem;
    }
    .toc-toggle {
      display: none;
    }
    .toc-list {
      max-height: none;
    }
    .toc-list.open {
      max-height: none;
    }
    .toc-list li + li {
      border-top: 1px solid #c8ccd1;
    }
  }

  .back-to-top {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 20;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    border: 1px solid #a2a9b1;
    border-radius: 50%;
    background: #f8f9fa;
    color: #333;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transition:
      background 0.2s,
      transform 0.2s;
  }
  .back-to-top:hover {
    background: #eee;
    transform: translateY(-2px);
  }
  .back-to-top:focus-visible {
    outline: 2px solid #654074;
    outline-offset: 2px;
  }
</style>
