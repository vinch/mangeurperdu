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

  .subtitle {
    margin-top: -0.25rem;
    margin-bottom: 1rem;
    font-weight: 750;
    letter-spacing: -0.01em;
    color: var(--mp-muted);
    font-size: 1.1rem;
  }

  .copy :global(p) {
    margin-bottom: 1.1rem;
    color: var(--mp-muted);
    max-width: 75ch;
  }
</style>

