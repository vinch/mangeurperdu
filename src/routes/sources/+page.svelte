<script lang="ts">
  type SourceItem = {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    url: string;
    published_at: string | null;
  };

  type SourcesPageData = {
    items: SourceItem[];
    loadError: string | null;
  };

  let { data }: { data: SourcesPageData } = $props();

  function fmtPublished(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }
</script>

<svelte:head>
  <title>Sources — Mangeur Perdu</title>
  <meta
    name="description"
    content="Articles et références cités sur le compte Instagram Mangeur Perdu."
  />
</svelte:head>

<div class="page sources mp-prose">
  <h1>Sources</h1>

  <p class="intro">
    Liens vers des articles dont je parle sur
    <a
      href="https://www.instagram.com/mangeurperdu/"
      target="_blank"
      rel="noopener noreferrer"><em>@mangeurperdu</em></a
    >.
  </p>

  {#if data.loadError}
    <p class="error">{data.loadError}</p>
  {/if}

  {#if !data.loadError && data.items.length === 0}
    <p class="empty">Aucune source pour le moment.</p>
  {:else if data.items.length > 0}
    <ul class="list">
      {#each data.items as item (item.id)}
        <li>
          <a class="row" href={item.url} target="_blank" rel="noopener noreferrer">
            <span class="label">{item.title}</span>
            {#if item.published_at}
              <span class="meta">{fmtPublished(item.published_at)}</span>
            {:else}
              <span class="meta">{fmtPublished(item.created_at)}</span>
            {/if}
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .intro {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #56616b;
    line-height: 1.55;
  }

  .error {
    color: #8b0000;
    font-weight: 600;
  }

  .empty {
    color: #56616b;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
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

  .meta {
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

    .meta {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .arrow {
      grid-row: 1 / span 2;
    }
  }
</style>
