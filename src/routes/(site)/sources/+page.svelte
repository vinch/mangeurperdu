<script lang="ts">
  type SourceItem = {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    url: string;
    published_at: string | null;
    source_name: string | null;
  };

  type SourcesPageData = {
    items: SourceItem[];
    loadError: string | null;
  };

  let { data }: { data: SourcesPageData } = $props();

  function fmtDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

<div class="content-page sources">
  <header class="content-head">
    <h1>Sources</h1>
    <p class="content-intro">
      Liens vers des articles dont je parle sur
      <a
        href="https://www.instagram.com/mangeurperdu/"
        target="_blank"
        rel="noopener noreferrer">@mangeurperdu</a
      >.
    </p>
  </header>

  {#if data.loadError}
    <p class="error">{data.loadError}</p>
  {/if}

  {#if !data.loadError && data.items.length === 0}
    <p class="empty">Aucune source pour le moment.</p>
  {:else if data.items.length > 0}
    <ul class="content-list">
      {#each data.items as item (item.id)}
        <li>
          <a
            class="row"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="label">{item.title}</span>
            <span class="meta">
              {#if item.published_at}
                {#if item.source_name}
                  <strong class="source-name">{item.source_name}</strong><span
                    class="sep"
                    aria-hidden="true">·</span
                  >
                {/if}Publié le {fmtDate(item.published_at)}
              {:else if item.source_name}
                <strong class="source-name">{item.source_name}</strong>
              {:else}
                Source
              {/if}
            </span>
            <span class="ext" aria-hidden="true"></span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  /* Icône "lien externe" calée en haut à droite (remplace la flèche). */
  .ext {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
    /* Centrée sur la première ligne du titre (compense le line-height). */
    margin-top: 0.2rem;
    width: 1.05rem;
    height: 1.05rem;
    background: var(--mp-purple);
    -webkit-mask: var(--mp-external-icon) center / contain no-repeat;
    mask: var(--mp-external-icon) center / contain no-repeat;
  }

  .error {
    color: #8b0000;
    font-weight: 600;
  }

  .empty {
    color: #56616b;
  }

  .source-name {
    font-weight: 750;
  }

  .sep {
    margin: 0 0.5ch;
    opacity: 0.85;
  }
</style>
