<script lang="ts">
  import { onMount } from "svelte";

  let {
    sources,
    alt = "",
    intervalMs = 5000,
    fadeMs = 1200,
    width,
    height,
    loading = "lazy" as "eager" | "lazy",
  }: {
    sources: string[];
    alt?: string;
    intervalMs?: number;
    fadeMs?: number;
    width?: number;
    height?: number;
    loading?: "eager" | "lazy";
  } = $props();

  let active = $state(0);

  onMount(() => {
    if (sources.length <= 1) return;

    active = Math.floor(Math.random() * sources.length);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = window.setInterval(() => {
      active = (active + 1) % sources.length;
    }, intervalMs);

    return () => window.clearInterval(id);
  });
</script>

<div
  class="crossfade"
  style:--crossfade-ms="{fadeMs}ms"
  aria-roledescription="carousel"
  aria-label={alt || "Diaporama"}
>
  {#each sources as src, i (src)}
    <img
      {src}
      {alt}
      {width}
      {height}
      loading={i === 0 ? loading : "lazy"}
      decoding="async"
      class:is-active={i === active}
    />
  {/each}
</div>

<style>
  .crossfade {
    display: grid;
    width: 100%;
    height: 100%;
  }

  .crossfade > img {
    grid-area: 1 / 1;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity var(--crossfade-ms, 1.2s) ease-in-out;
    pointer-events: none;
  }

  .crossfade > img.is-active {
    opacity: 1;
    z-index: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .crossfade > img {
      transition: none;
    }
  }
</style>
