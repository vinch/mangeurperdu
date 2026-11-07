<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: Snippet;
  } = $props();
</script>

<header class="intro">
  <p class="mp-eyebrow">Partenaires</p>
  <h1>{title}</h1>
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
  <div class="copy">
    {@render children()}
  </div>
</header>

<style>
  .intro {
    margin-bottom: 0;
  }

  .intro h1 {
    margin-bottom: 0.85rem;
  }

  .subtitle {
    margin: 0 0 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--mp-line);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--mp-text);
    font-size: 1.3rem;
    line-height: 1.35;
  }

  .copy :global(p) {
    margin-bottom: 1.2rem;
    color: var(--mp-muted);
    font-size: 1.075rem;
    line-height: 1.7;
    max-width: 62ch;
  }

  .copy :global(p:first-child) {
    font-size: 1.2rem;
    color: var(--mp-text);
  }
</style>

