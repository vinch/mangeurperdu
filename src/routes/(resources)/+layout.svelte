<div class="resource-surface">
  <main class="resource-main mp-prose">
    <slot />
  </main>
</div>

<style>
  /* Harmonisé avec les autres pages : fond "papier" autour, contenu blanc centré. */
  .resource-surface {
    background: #fff;
    color: var(--mp-text);
    padding: 0;
  }

  .resource-main {
    background: #fff;
    /* Même colonne de lecture que les pages `.page mp-prose` (À propos, Conférences). */
    max-width: 75ch;
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
