<script context="module" lang="ts">
  export type FeaturedBrand = {
    slug: string;
    name: string;
    logo_url: string | null;
    website_url: string | null;
    short_description: string | null;
    long_description: string | null;
    instagram_reel_url: string | null;
  };
</script>

<script lang="ts">
  export let item: FeaturedBrand;
  export let density: "compact" | "default" = "default";

  $: title = item.name;
  $: text = item.long_description?.trim() || "";

  function cleanUrl(url: string | null): string | null {
    const u = (url ?? "").trim();
    return u ? u : null;
  }

  $: websiteUrl = cleanUrl(item.website_url);
  $: reelUrl = cleanUrl(item.instagram_reel_url);
</script>

<article class="card" data-density={density}>
  <div class="top">
    {#if item.logo_url}
      <div class="logo-badge" aria-hidden="true">
        <img
          class="logo"
          src={item.logo_url}
          alt={"Logo " + item.name}
          loading="lazy"
        />
      </div>
    {/if}
    <div class="head">
      <h3 class="title">{title}</h3>
      {#if item.short_description && density === "default"}
        <p class="kicker">{item.short_description}</p>
      {/if}
    </div>
  </div>

  {#if text}
    <p class="body">{text}</p>
  {/if}

  <div class="actions" aria-label="Liens externes">
    {#if websiteUrl}
      <a
        class="cta-secondary"
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={"Ouvrir le site de " + item.name}>Site</a
      >
    {/if}
    {#if reelUrl}
      <a
        class="cta-secondary"
        href={reelUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={"Voir le Reel Instagram : " + item.name}>Reel</a
      >
    {/if}
  </div>
</article>

<style>
  .card {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 1.05rem 1.05rem 0.95rem;
    background: rgba(255, 255, 255, 0.75);
  }

  .card[data-density="compact"] {
    padding: 0.85rem 0.95rem 0.85rem;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.65rem;
  }

  .logo-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    min-width: 44px;
    padding: 6px 10px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff;
    flex: 0 0 auto;
  }

  .card[data-density="compact"] .logo-badge {
    height: 40px;
    min-width: 40px;
    padding: 6px 10px;
  }

  .logo {
    display: block;
    height: 100%;
    width: auto;
    max-width: 92px;
    object-fit: contain;
  }

  .title {
    margin: 0;
    color: var(--mp-text);
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .kicker {
    margin: 0.25rem 0 0;
    color: rgba(86, 97, 107, 0.95);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .body {
    margin: 0 0 0.85rem;
    color: var(--mp-muted);
    line-height: 1.55;
    font-size: 0.98rem;
    white-space: pre-line;
  }

  .card[data-density="compact"] .body {
    margin-bottom: 0.75rem;
    font-size: 0.96rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .actions :global(.cta-secondary) {
    padding: 0.55rem 0.9rem;
    font-size: 0.92rem;
  }
</style>
