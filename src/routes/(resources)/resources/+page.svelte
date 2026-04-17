<svelte:head>
  <title>Ressources — Mangeur Perdu</title>
  <meta
    name="description"
    content="Ressources : étude sur les graisses et huiles, base additifs."
  />
</svelte:head>

<div class="resources">
  <h1>Ressources</h1>

  <ul class="list">
    <li>
      <a class="row" href="/fat">
        <span class="label">Méthode de classement des huiles et graisses</span>
        <span class="hint"
          >Scores, pondérations et détail des critères par usage.</span
        >
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </li>
    <li>
      <a class="row" href="/additives">
        <span class="label">Base de données des additifs</span>
        <span class="hint"
          >Une compilation exhaustive des additifs alimentaires, et de leur
          dangerosité potentielle.</span
        >
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </li>
  </ul>
</div>

<style>
  .list {
    list-style: none;
    padding: 0;
    margin: 1.25rem 0 0;
    display: grid;
    gap: 0.6rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: baseline;
    gap: 0.35rem 0.75rem;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      box-shadow 0.15s ease;
  }

  .row:hover {
    border-color: rgba(101, 64, 116, 0.22);
    background: rgba(101, 64, 116, 0.04);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  .row:focus-visible {
    outline: 2px solid var(--mp-purple);
    outline-offset: 2px;
  }

  .label {
    grid-column: 1;
    font-weight: 650;
    color: #1f2d3a;
  }

  .hint {
    grid-column: 1;
    grid-row: 2;
    font-size: 0.88rem;
    color: #6a737c;
    margin-top: -0.1rem;
  }

  .arrow {
    grid-column: 3;
    grid-row: 1 / span 2;
    align-self: center;
    font-size: 1.1rem;
    color: var(--mp-purple);
    font-weight: 600;
    line-height: 1;
  }

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr auto;
    }

    .hint {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .arrow {
      grid-row: 1 / span 2;
    }
  }
</style>
