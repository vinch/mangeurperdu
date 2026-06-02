<script lang="ts">
  import { page } from "$app/state";

  // La landing "Ressources" utilise la mise en page large commune ;
  // la page "fat" garde une colonne de lecture étroite.
  let wide = $derived(
    page.url.pathname === "/resources" || page.url.pathname === "/resources/"
  );
</script>

<div class="resource-surface">
  <main class="resource-main mp-prose" class:is-wide={wide}>
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

  /* Landing Ressources : pleine largeur, alignée comme Sources / Collaborations. */
  .resource-main.is-wide {
    max-width: var(--mp-shell-max);
    padding: 2.5rem var(--mp-shell-pad-x, 1.25rem) 4rem;
  }

  /* Même titre que la page Conférences : `h1` global + marges du bloc `.header-copy h1`. */
  .resource-main :global(h1) {
    margin-top: 0;
    margin-bottom: 0.6rem;
  }
</style>
