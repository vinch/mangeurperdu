<div class="resource-surface">
  <main class="resource-main">
    <slot />
  </main>
</div>

<style>
  /* Même socle que l’ancienne page graisses (`.fat-page` + `main`) */
  .resource-surface {
    background: #fff;
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
  }

  .resource-main {
    max-width: var(--mp-content-max, 52rem);
    margin: 0 auto;
    /* Même écart sous le header que `.page` (ex. À propos) : padding-top 4rem */
    padding: 4rem var(--mp-shell-pad-x, 1.25rem) 3rem;
    box-sizing: border-box;
  }

  /* Même titre que la page Conférences : `h1` global + marges du bloc `.header-copy h1`. */
  .resource-main :global(h1) {
    margin-top: 0;
    margin-bottom: 0.6rem;
  }
</style>
