<script lang="ts">
  import SiteHeader from "../lib/components/SiteHeader.svelte";
  import SiteFooter from "../lib/components/SiteFooter.svelte";
</script>

<svelte:head>
  <!-- Meta par défaut (surchargées par les pages) -->
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="site-shell">
  <SiteHeader variant="dark" />
  <main class="site-main">
    <slot />
  </main>
  <SiteFooter />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
    min-height: 100vh;
  }

  :global(:root) {
    --mp-purple: #654074;
    --mp-purple-900: #3a2442;
    --mp-purple-hover: #52335d;
    --mp-text: #2c3e50;
    --mp-muted: #56616b;
    --mp-surface: #ffffff;
    --mp-surface-2: rgba(255, 255, 255, 0.9);
    /* Aligné sur SiteHeader .inner / SiteFooter .footer-inner */
    --mp-shell-max: 1100px;
    /* Colonne de lecture : pages .page (À propos, Conférences) + ressources */
    --mp-content-max: 52rem;
    --mp-shell-pad-x: 1.25rem;
    /* Boutons / CTA (pilule, même échelle partout) */
    --mp-btn-radius: 999px;
    --mp-btn-pad-y: 0.65rem;
    --mp-btn-pad-x: 1.1rem;
    --mp-btn-font-size: 0.95rem;
    --mp-btn-font-weight: 700;
    /* Liens texte dans le contenu */
    --mp-link: var(--mp-purple);
    --mp-link-hover: var(--mp-purple-hover);
    --mp-link-underline: rgba(101, 64, 116, 0.38);
  }

  /* Liens “inline” : violet discret + soulignement (hors boutons / cartes / header) */
  :global(
    main.site-main
      a:not(.cta):not(.cta-secondary):not(.brand):not(.row):not(.back-link):not(
        .primary
      ):not(.place-link)
  ) {
    color: var(--mp-link);
    text-decoration: underline;
    text-decoration-color: var(--mp-link-underline);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
    font-weight: 500;
    transition:
      color 0.15s ease,
      text-decoration-color 0.15s ease;
  }

  :global(
    main.site-main
      a:not(.cta):not(.cta-secondary):not(.brand):not(.row):not(.back-link):not(
        .primary
      ):not(.place-link):hover
  ) {
    color: var(--mp-link-hover);
    text-decoration-color: var(--mp-link);
  }

  :global(
    main.site-main
      a:not(.cta):not(.cta-secondary):not(.brand):not(.row):not(.back-link):not(
        .primary
      ):not(.place-link):visited
  ) {
    color: var(--mp-link);
  }

  /* Primaire : liens <a> et composants type EmailLink */
  :global(a.cta),
  :global(.cta) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-decoration: none;
    font-family: inherit;
    font-weight: var(--mp-btn-font-weight);
    font-size: var(--mp-btn-font-size);
    line-height: 1.2;
    color: #fff;
    background: var(--mp-purple);
    padding: var(--mp-btn-pad-y) var(--mp-btn-pad-x);
    border-radius: var(--mp-btn-radius);
    border: none;
    cursor: pointer;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.15s ease;
  }

  :global(a.cta:hover),
  :global(.cta:hover) {
    background: var(--mp-purple-hover);
  }

  /* Secondaire : contour (ex. « Infos / billets », lien ghost) */
  :global(a.cta-secondary),
  :global(.cta-secondary) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-decoration: none;
    font-family: inherit;
    font-weight: var(--mp-btn-font-weight);
    font-size: var(--mp-btn-font-size);
    line-height: 1.2;
    color: #5a4a63;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: var(--mp-btn-pad-y) var(--mp-btn-pad-x);
    border-radius: var(--mp-btn-radius);
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      color 0.15s ease;
  }

  :global(a.cta-secondary:hover),
  :global(.cta-secondary:hover) {
    border-color: rgba(101, 64, 116, 0.35);
    background: rgba(101, 64, 116, 0.04);
    color: var(--mp-purple);
  }

  :global(.site-shell) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  :global(.site-main) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  :global(.container) {
    display: flex;
    min-height: 100vh;
  }

  :global(.book-image) {
    flex: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.book-image img) {
    width: 100%;
    height: auto;
  }

  :global(h1) {
    font-size: 2.5rem;
    line-height: 1em;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  :global(p) {
    margin-bottom: 2rem;
    color: #666;
  }

  :global(.signup-form) {
    flex: 0.4;
    background: white;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5rem;
  }

  :global(.social-links) {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  :global(.social-links a) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 12px;
    border-radius: 4px;
    text-decoration: none;
    color: #666;
    font-weight: 400;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    background: transparent;
  }

  :global(.social-links a:hover) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
  }

  :global(.social-links .instagram:hover) {
    border-color: #e6683c;
    color: #e6683c;
  }

  :global(.social-links .youtube:hover) {
    border-color: #ff0000;
    color: #ff0000;
  }

  :global(.social-links svg) {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  :global(.form-group) {
    margin-bottom: 1.5rem;
  }

  :global(input[type="email"]) {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  :global(input[type="email"]:focus) {
    outline: none;
    border-color: #654074;
  }

  /* NOTE: Ne pas styliser tous les <button> globalement.
     Sinon ça “pollue” des boutons utilitaires (tuiles, modales, toggles, etc.).
     Les styles CTA sont portés par `.cta` / `.cta-secondary` (déjà définis plus haut). */
  :global(button.cta:disabled),
  :global(button.cta-secondary:disabled) {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    :global(.container) {
      flex-direction: column;
    }

    :global(.book-image) {
      padding: 1rem;
    }

    :global(.signup-form) {
      padding: 2rem;
    }

    :global(.placeholder) {
      display: none;
    }
  }

  /* Même largeur de contenu que les pages ressources (.resource-main) */
  :global(.page) {
    background: white;
    padding: 4rem var(--mp-shell-pad-x);
    max-width: var(--mp-content-max);
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

</style>
