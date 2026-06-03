<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const year = new Date().getFullYear();
</script>

<div class="ency-shell">
  <header class="ency-header">
    <div class="ency-header-inner">
      <a class="ency-back" href="/resources">← Ressources</a>
      <a class="ency-brand" href="/additives">Additifs alimentaires</a>
    </div>
  </header>

  <main class="ency-main mp-prose">
    {@render children()}
  </main>

  <footer class="ency-footer">
    <div class="ency-footer-inner">
      <p class="ency-copy">© {year} Mangeur Perdu</p>
      <p class="ency-footer-note">
        Évaluation éditoriale à visée informative — ne remplace pas un avis
        médical ou scientifique.
      </p>
    </div>
  </footer>
</div>

<style>
  .ency-shell {
    /* Mêmes codes que la page "Huiles & graisses" : fond blanc, cartes grises. */
    --mp-canvas: #fff;
    --mp-paper: #f7f8fa;
    --mp-border: rgba(17, 24, 39, 0.08);

    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    color: var(--mp-text, #1f2d3a);
  }

  .ency-header {
    background: #fff;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .ency-header-inner {
    max-width: 75ch;
    margin: 0 auto;
    padding: 0.9rem var(--mp-shell-pad-x, 1.25rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ency-back {
    font-size: 0.9rem;
    font-weight: 600;
    color: #56616b;
    text-decoration: none;
  }

  .ency-back:hover {
    color: var(--mp-purple, #654074);
  }

  .ency-brand {
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--mp-text, #1f2d3a);
    text-decoration: none;
  }

  .ency-brand:hover {
    color: var(--mp-purple, #654074);
  }

  .ency-main {
    flex: 1;
    width: 100%;
    max-width: 75ch;
    margin: 0 auto;
    padding: 2.5rem var(--mp-shell-pad-x, 1.25rem) 3rem;
    box-sizing: border-box;
  }

  .ency-main :global(h1) {
    margin-top: 0;
  }

  .ency-footer {
    background: #fff;
    border-top: 1px solid rgba(17, 24, 39, 0.08);
    padding: 1.25rem var(--mp-shell-pad-x, 1.25rem);
  }

  .ency-footer-inner {
    max-width: 75ch;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1rem;
  }

  .ency-copy,
  .ency-footer-note {
    margin: 0;
    font-size: 0.85rem;
    color: #56616b;
  }
</style>
