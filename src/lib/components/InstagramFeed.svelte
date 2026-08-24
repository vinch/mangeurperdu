<script lang="ts">
  import type { InstagramPost } from "$lib/types/instagram";
  import { instagramHandle, instagramProfileUrl } from "$lib/instagram/config";

  let {
    posts = [],
    loadError = null,
  }: {
    posts?: InstagramPost[];
    loadError?: string | null;
  } = $props();

  function formatCount(n: number): string {
    return new Intl.NumberFormat("fr-FR").format(n);
  }

  function truncateCaption(text: string | null, max = 80): string {
    if (!text) return "";
    const oneLine = text.replace(/\s+/g, " ").trim();
    if (oneLine.length <= max) return oneLine;
    return `${oneLine.slice(0, max - 1)}…`;
  }

  function hideBrokenImage(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    img.style.display = "none";
    img.closest("li")?.remove();
  }
</script>

<section class="instagram-section" aria-labelledby="instagram-heading">
  <div class="instagram-inner site-container">
    <header class="instagram-header">
      <div class="instagram-intro">
        <h2 id="instagram-heading">Dernières publications</h2>
        <p class="instagram-meta">
          <a
            class="instagram-handle"
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer">@{instagramHandle}</a
          >
        </p>
      </div>
      <a
        class="btn-light-lg btn-external"
        href={instagramProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Suivre sur Instagram
      </a>
    </header>

    {#if loadError}
      <p class="instagram-notice" role="status">{loadError}</p>
    {/if}

    {#if posts.length > 0}
      <ul class="instagram-grid">
        {#each posts as post (post.id)}
          <li>
            <a
              class="post-card"
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={post.mediaUrl}
                alt={truncateCaption(post.caption) || "Publication Instagram"}
                loading="lazy"
                decoding="async"
                onerror={hideBrokenImage}
              />
              <span class="post-veil" aria-hidden="true"></span>
              <span class="post-stats" aria-hidden="true">
                <span class="post-stat">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  {formatCount(post.likeCount)}
                </span>
                <span class="post-stat">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"
                    />
                  </svg>
                  {formatCount(post.commentCount)}
                </span>
              </span>
            </a>
          </li>
        {/each}
      </ul>
    {:else if !loadError}
      <p class="instagram-notice">
        Aucune publication à afficher pour le moment. Retrouvez le fil sur
        <a
          class="instagram-handle"
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer">@{instagramHandle}</a
        >.
      </p>
    {/if}
  </div>
</section>

<style>
  .instagram-section {
    padding: 0 0 4rem;
    background: #1a2330;
    color: #fff;
  }

  .instagram-inner {
    padding-top: 3.5rem;
  }

  .instagram-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .instagram-intro {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .instagram-header h2 {
    margin: 0;
    font-family: var(--mp-font-sans);
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.15;
    color: #fff;
  }

  .instagram-meta {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.35;
  }

  :global(a.instagram-handle),
  :global(a.instagram-handle:visited) {
    color: #c8b8d8;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: rgba(200, 184, 216, 0.55);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }

  :global(a.instagram-handle:hover) {
    color: #e2d6eb;
    text-decoration-color: rgba(226, 214, 235, 0.7);
  }

  .instagram-notice {
    margin: 0;
    padding: 1.25rem 1.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.55;
  }

  .instagram-notice :global(a.instagram-handle) {
    color: #c8b8d8;
  }

  .instagram-notice :global(a.instagram-handle:hover) {
    color: #e2d6eb;
  }

  .instagram-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  .post-card {
    position: relative;
    display: block;
    aspect-ratio: 3 / 4;
    border-radius: var(--mp-radius-md, 14px);
    overflow: hidden;
    background: #f0f0f0;
    text-decoration: none;
    color: #fff;
  }

  .post-veil,
  .post-stats {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  .post-veil {
    background: rgba(0, 0, 0, 0);
    transition: background-color 0.25s ease;
  }

  .post-card:hover .post-veil,
  .post-card:focus-visible .post-veil {
    background: rgba(0, 0, 0, 0.5);
  }

  .post-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.35rem;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .post-card:hover .post-stats,
  .post-card:focus-visible .post-stats {
    opacity: 1;
  }

  .post-stat {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .post-stat svg {
    flex-shrink: 0;
  }

  .post-card > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 900px) {
    .instagram-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 520px) {
    .instagram-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .instagram-header :global(.btn-light-lg) {
      width: 100%;
      text-align: center;
    }
  }
</style>
