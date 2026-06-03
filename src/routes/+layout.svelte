<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <!-- Meta par défaut (surchargées par les pages) -->
  <meta name="robots" content="index, follow" />
</svelte:head>

{@render children()}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap");

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: var(--mp-font-sans);
    line-height: var(--mp-leading-body);
    color: var(--mp-text);
    background-color: #fff;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  :global(:root) {
    --mp-font-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial,
      sans-serif;
    /* Plus de serif : on reste sur Inter partout. (alias conservé pour compat) */
    --mp-font-serif: var(--mp-font-sans);
    --mp-leading-body: 1.62;
    --mp-leading-title: 1.08;

    --mp-purple: #654074;
    --mp-purple-900: #3a2442;
    --mp-purple-hover: #52335d;
    --mp-text: #1f2d3a;
    --mp-muted: rgba(31, 45, 58, 0.72);
    --mp-canvas: #f4f1ec;
    --mp-paper: #ffffff;
    --mp-surface: #ffffff;
    --mp-surface-2: rgba(255, 255, 255, 0.92);
    --mp-border: rgba(17, 24, 39, 0.12);

    --mp-radius-sm: 10px;
    --mp-radius-md: 14px;
    --mp-radius-lg: 18px;

    --mp-space-1: 0.5rem;
    --mp-space-2: 0.75rem;
    --mp-space-3: 1rem;
    --mp-space-4: 1.5rem;
    --mp-space-5: 2.25rem;

    /* Aligné sur SiteHeader .inner / SiteFooter .footer-inner */
    --mp-shell-max: 1180px;
    /* Colonne de lecture : pages .page (À propos, Conférences) + ressources */
    --mp-content-max: 52rem;
    --mp-shell-pad-x: 1.25rem;
    /* Largeur utile alignée header / site-container (max-width inclut le padding) */
    --mp-shell-inner: min(
      calc(var(--mp-shell-max) - 2 * var(--mp-shell-pad-x)),
      calc(100vw - 2 * var(--mp-shell-pad-x))
    );
    /* Boutons : foncé / clair × lg / sm */
    --mp-btn-radius: 999px;
    --mp-btn-dark-bg: #1f2d3a;
    --mp-btn-dark-bg-hover: #354a5f;
    --mp-btn-light-bg: #fff;
    --mp-btn-light-bg-hover: #f5f6f7;
    --mp-btn-light-border: rgba(31, 45, 58, 0.18);
    --mp-btn-light-border-hover: rgba(31, 45, 58, 0.28);
    --mp-btn-font-weight: 700;
    /* Liens texte dans le contenu */
    --mp-link: var(--mp-purple);
    --mp-link-hover: var(--mp-purple-hover);
    --mp-link-underline: rgba(101, 64, 116, 0.38);
    --mp-external-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/%3E%3Cpolyline points='15 3 21 3 21 9'/%3E%3Cline x1='10' y1='14' x2='21' y2='3'/%3E%3C/svg%3E");
    --mp-mail-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E%3Cpath d='m3 7 9 6 9-6'/%3E%3C/svg%3E");
  }

  /* Liens “inline” : violet discret + soulignement (hors boutons / cartes / header) */
  :global(
      main.site-main
        a:not(.btn-dark-lg):not(.btn-dark-sm):not(.btn-light-lg):not(
          .btn-light-sm
        ):not(.cta):not(.cta-secondary):not(.brand):not(.row):not(
          .back-link
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card)
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
        a:not(.btn-dark-lg):not(.btn-dark-sm):not(.btn-light-lg):not(
          .btn-light-sm
        ):not(.cta):not(.cta-secondary):not(.brand):not(.row):not(
          .back-link
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card):hover
    ) {
    color: var(--mp-link-hover);
    text-decoration-color: var(--mp-link);
  }

  :global(
      main.site-main
        a:not(.btn-dark-lg):not(.btn-dark-sm):not(.btn-light-lg):not(
          .btn-light-sm
        ):not(.cta):not(.cta-secondary):not(.brand):not(.row):not(
          .back-link
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card):visited
    ) {
    color: var(--mp-link);
  }

  /* Boutons — socle commun */
  :global(a.btn-dark-lg),
  :global(a.btn-dark-sm),
  :global(a.btn-light-lg),
  :global(a.btn-light-sm),
  :global(a.cta),
  :global(a.cta-secondary),
  :global(button.btn-dark-lg),
  :global(button.btn-dark-sm),
  :global(button.btn-light-lg),
  :global(button.btn-light-sm),
  :global(button.cta),
  :global(button.cta-secondary),
  :global(.btn-dark-lg),
  :global(.btn-dark-sm),
  :global(.btn-light-lg),
  :global(.btn-light-sm),
  :global(.cta),
  :global(.cta-secondary) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: inherit;
    font-weight: var(--mp-btn-font-weight);
    line-height: 1.2;
    text-decoration: none;
    border-radius: var(--mp-btn-radius);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }

  :global(a.btn-dark-lg),
  :global(a.btn-dark-sm),
  :global(a.cta),
  :global(button.btn-dark-lg),
  :global(button.btn-dark-sm),
  :global(button.cta),
  :global(.btn-dark-lg),
  :global(.btn-dark-sm),
  :global(.cta) {
    background: var(--mp-btn-dark-bg);
    color: #fff;
    border-color: var(--mp-btn-dark-bg);
  }

  :global(a.btn-dark-lg:hover:not(:disabled)),
  :global(a.btn-dark-sm:hover:not(:disabled)),
  :global(a.cta:hover:not(:disabled)),
  :global(button.btn-dark-lg:hover:not(:disabled)),
  :global(button.btn-dark-sm:hover:not(:disabled)),
  :global(button.cta:hover:not(:disabled)),
  :global(.btn-dark-lg:hover:not(:disabled)),
  :global(.btn-dark-sm:hover:not(:disabled)),
  :global(.cta:hover:not(:disabled)) {
    background: var(--mp-btn-dark-bg-hover);
    border-color: var(--mp-btn-dark-bg-hover);
  }

  :global(a.btn-light-lg),
  :global(a.btn-light-sm),
  :global(a.cta-secondary),
  :global(button.btn-light-lg),
  :global(button.btn-light-sm),
  :global(button.cta-secondary),
  :global(.btn-light-lg),
  :global(.btn-light-sm),
  :global(.cta-secondary) {
    background: var(--mp-btn-light-bg);
    color: var(--mp-btn-dark-bg);
    border-color: var(--mp-btn-light-border);
  }

  :global(a.btn-light-lg:hover:not(:disabled)),
  :global(a.btn-light-sm:hover:not(:disabled)),
  :global(a.cta-secondary:hover:not(:disabled)),
  :global(button.btn-light-lg:hover:not(:disabled)),
  :global(button.btn-light-sm:hover:not(:disabled)),
  :global(button.cta-secondary:hover:not(:disabled)),
  :global(.btn-light-lg:hover:not(:disabled)),
  :global(.btn-light-sm:hover:not(:disabled)),
  :global(.cta-secondary:hover:not(:disabled)) {
    background: var(--mp-btn-light-bg-hover);
    border-color: var(--mp-btn-light-border-hover);
  }

  :global(a.btn-dark-lg),
  :global(a.btn-light-lg),
  :global(a.cta),
  :global(a.cta-secondary),
  :global(button.btn-dark-lg),
  :global(button.btn-light-lg),
  :global(button.cta),
  :global(button.cta-secondary),
  :global(.btn-dark-lg),
  :global(.btn-light-lg),
  :global(.cta),
  :global(.cta-secondary) {
    padding: 0.75rem 1.35rem;
    font-size: 0.95rem;
  }

  :global(a.btn-dark-sm),
  :global(a.btn-light-sm),
  :global(button.btn-dark-sm),
  :global(button.btn-light-sm),
  :global(.btn-dark-sm),
  :global(.btn-light-sm) {
    padding: 0.55rem 1rem;
    font-size: 0.88rem;
  }

  /* Icônes après le texte des boutons : lien externe / email */
  :global(.btn-external::after),
  :global(.btn-mail::after) {
    content: "";
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    margin-left: 0.5em;
    background-color: currentColor;
    -webkit-mask: var(--btn-icon) center / contain no-repeat;
    mask: var(--btn-icon) center / contain no-repeat;
  }

  :global(.btn-external) {
    --btn-icon: var(--mp-external-icon);
  }

  :global(.btn-mail) {
    --btn-icon: var(--mp-mail-icon);
  }

  :global(.site-shell) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Aligne header, home, footer sur la même colonne */
  :global(.site-container) {
    width: 100%;
    max-width: var(--mp-shell-max);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--mp-shell-pad-x);
    padding-right: var(--mp-shell-pad-x);
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    :global(:root) {
      --mp-shell-pad-x: 2rem;
    }
  }

  @media (min-width: 1100px) {
    :global(:root) {
      --mp-shell-pad-x: 2.35rem;
    }
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
    font-family: var(--mp-font-serif);
    font-size: 3rem;
    line-height: var(--mp-leading-title);
    margin-bottom: 1.5rem;
    color: var(--mp-text);
    letter-spacing: -0.02em;
    font-optical-sizing: auto;
  }

  :global(h2),
  :global(h3) {
    font-family: var(--mp-font-serif);
    color: var(--mp-text);
    letter-spacing: -0.015em;
    font-optical-sizing: auto;
  }

  :global(p) {
    margin-bottom: 1.35rem;
    color: var(--mp-muted);
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
     Sinon ça “pollue” des boutons utilitaires (tuiles, modales, toggles, etc.). */
  :global(button.btn-dark-lg:disabled),
  :global(button.btn-dark-sm:disabled),
  :global(button.btn-light-lg:disabled),
  :global(button.btn-light-sm:disabled),
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

  /* —— Pages de contenu classique : Ressources, Sources, Collaborations —— */
  /* Pleine largeur du shell, aligné à gauche, posé (pas flottant). */
  :global(.content-page) {
    width: 100%;
    max-width: var(--mp-shell-max);
    margin: 0 auto;
    padding: 2.5rem var(--mp-shell-pad-x) 4rem;
    box-sizing: border-box;
  }

  :global(.content-head) {
    margin: 0 0 1.75rem;
    padding-bottom: 1.4rem;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  }

  :global(.content-head > h1) {
    margin: 0 0 0.5rem;
  }

  :global(.content-intro) {
    margin: 0;
    max-width: 62ch;
    color: var(--mp-muted);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  :global(.content-list) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 21rem), 1fr));
    /* Toutes les rangées à la même hauteur (alignée sur la plus haute). */
    grid-auto-rows: 1fr;
    gap: 0.85rem;
  }

  /* Le <li> est l'item de grille : on le fait remplir la hauteur de sa rangée
     pour que le `.row` à l'intérieur prenne toute la place. */
  :global(.content-list > li) {
    display: flex;
  }

  /* `.row` est déjà exclu du style "lien inline" (voir sélecteur plus haut). */
  :global(.content-list .row) {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    align-items: start;
    gap: 0.2rem 1rem;
    padding: 1.2rem 1.35rem;
    border-radius: 14px;
    border: none;
    background: #f4f6f8;
    text-decoration: none;
    color: inherit;
    transition: background 0.15s ease;
  }

  :global(.content-list .row:hover) {
    background: rgba(101, 64, 116, 0.09);
  }

  :global(.content-list .row:focus-visible) {
    outline: 2px solid var(--mp-purple);
    outline-offset: 2px;
  }

  :global(.content-list .row .label) {
    grid-column: 1;
    font-weight: 650;
    color: #1f2d3a;
    /* 3 lignes max, ellipsis au-delà. */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :global(.content-list .row .hint),
  :global(.content-list .row .meta) {
    grid-column: 1;
    grid-row: 2;
    font-size: 0.9rem;
    color: #6a737c;
  }

  /* Description (Ressources) : juste sous le titre. */
  :global(.content-list .row .hint) {
    align-self: start;
  }

  /* Méta (Sources) : collée en bas de la carte. */
  :global(.content-list .row .meta) {
    align-self: end;
  }

  :global(.content-list .row .arrow) {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
    /* Même position que l'icône lien externe de Sources : calée sur la 1ʳᵉ ligne du titre. */
    margin-top: 0.2rem;
    width: 1.05rem;
    height: 1.05rem;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1;
    color: var(--mp-purple);
  }

  /* Encart CTA commun (fond teinté, sans bordure) */
  /* Encart CTA aligné sur la box "Organisateurs" (page Conférences). */
  :global(.content-cta) {
    margin: 2.5rem 0 0;
    padding: 1.5rem;
    border-radius: 14px;
    border: none;
    background: rgba(101, 64, 116, 0.08);
    box-sizing: border-box;
  }

  :global(.content-cta > h2) {
    margin: 0 0 0.6rem;
    font-size: 1.4rem;
    line-height: 1.2;
    color: #2c3e50;
  }

  :global(.content-cta .content-cta-text) {
    margin: 0 0 1.1rem;
    max-width: 60ch;
    color: #56616b;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  :global(.content-cta .cta) {
    margin-top: 0;
  }

  :global(.mp-section) {
    padding: 4rem var(--mp-shell-pad-x);
  }

  :global(.mp-card) {
    border: 1px solid var(--mp-border);
    border-radius: var(--mp-radius-md);
    background: var(--mp-surface);
  }

  :global(.mp-prose) {
    max-width: 75ch;
  }

  :global(.mp-stack > * + *) {
    margin-top: var(--mp-space-3);
  }
</style>
