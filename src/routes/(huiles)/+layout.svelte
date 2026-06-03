<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const year = new Date().getFullYear();
</script>

<div class="huiles-shell">
  <header class="huiles-header">
    <div class="huiles-header-inner">
      <a class="huiles-back" href="/resources">← Ressources</a>
      <a class="huiles-brand" href="/fat">Huiles &amp; graisses</a>
    </div>
  </header>

  <main class="huiles-main mp-prose">
    {@render children()}
  </main>

  <footer class="huiles-footer">
    <div class="huiles-footer-inner">
      <p class="huiles-copy">© {year} Mangeur Perdu</p>
      <p class="huiles-note">
        Évaluation éditoriale à visée informative — ne remplace pas un avis
        médical ou nutritionnel.
      </p>
    </div>
  </footer>
</div>

<style>
  .huiles-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    color: var(--mp-text, #1f2d3a);
  }

  .huiles-header {
    background: #fff;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .huiles-header-inner {
    max-width: 75ch;
    margin: 0 auto;
    padding: 0.9rem var(--mp-shell-pad-x, 1.25rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .huiles-back {
    font-size: 0.9rem;
    font-weight: 600;
    color: #56616b;
    text-decoration: none;
  }

  .huiles-back:hover {
    color: var(--mp-purple, #654074);
  }

  .huiles-brand {
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--mp-text, #1f2d3a);
    text-decoration: none;
  }

  .huiles-brand:hover {
    color: var(--mp-purple, #654074);
  }

  .huiles-main {
    flex: 1;
    width: 100%;
    max-width: 75ch;
    margin: 0 auto;
    padding: 2.5rem var(--mp-shell-pad-x, 1.25rem) 3rem;
    box-sizing: border-box;
  }

  .huiles-main :global(h1) {
    margin-top: 0;
  }

  .huiles-footer {
    background: #fff;
    border-top: 1px solid rgba(17, 24, 39, 0.08);
    padding: 1.25rem var(--mp-shell-pad-x, 1.25rem);
  }

  .huiles-footer-inner {
    max-width: 75ch;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1rem;
  }

  .huiles-copy,
  .huiles-note {
    margin: 0;
    font-size: 0.85rem;
    color: #56616b;
  }
</style>
