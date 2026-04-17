<script lang="ts">
  import FeaturedSelectionCard from "./FeaturedSelectionCard.svelte";
  import type { FeaturedBrand } from "./FeaturedSelectionCard.svelte";

  export let items: FeaturedBrand[] = [];
  export let density: "compact" | "default" = "default";
</script>

<section class="section" aria-label="Sélection">
  {#if items.length === 0}
    <p class="empty">Rien à afficher pour le moment.</p>
  {:else}
    <ul class="grid" data-density={density}>
      {#each items as item (item.slug)}
        <li>
          <FeaturedSelectionCard {item} {density} />
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .section {
    margin-top: 1.5rem;
  }

  .empty {
    color: var(--mp-muted);
  }

  .grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.9rem;
  }

  .grid[data-density="compact"] {
    gap: 0.75rem;
  }
</style>

