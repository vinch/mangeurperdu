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
  @import url("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap");

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: var(--mp-font-sans);
    line-height: var(--mp-leading-body);
    color: var(--mp-text);
    background-color: var(--mp-bg);
    min-height: 100vh;
    font-optical-sizing: auto;
    font-feature-settings: "cv11", "ss03";
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
    --mp-purple-soft: #f1ebf3;
    /* Orange de la couverture du livre : accent éditorial (eyebrows, filets). */
    --mp-orange: #d2700f;
    --mp-orange-ink: #a8540a;
    --mp-orange-soft: #fbeedd;

    --mp-ink: #141c26;
    --mp-text: #1b2632;
    --mp-muted: #5a6470;
    --mp-subtle: #8a9099;
    --mp-night: #141c26;

    /* Fonds chauds : page légèrement crème, cartes blanches, blocs sable. */
    --mp-bg: #fbfaf7;
    --mp-canvas: #f4efe7;
    --mp-sand: #f4efe7;
    --mp-paper: #ffffff;
    --mp-surface: #ffffff;
    --mp-surface-2: rgba(255, 255, 255, 0.92);
    --mp-border: rgba(27, 38, 50, 0.1);
    --mp-line: rgba(27, 38, 50, 0.08);

    --mp-shadow-sm: 0 1px 2px rgba(20, 28, 38, 0.05);
    --mp-shadow-md: 0 1px 2px rgba(20, 28, 38, 0.04),
      0 8px 24px -12px rgba(20, 28, 38, 0.16);
    --mp-shadow-lg: 0 2px 4px rgba(20, 28, 38, 0.04),
      0 24px 48px -20px rgba(20, 28, 38, 0.28);
    --mp-ease: cubic-bezier(0.22, 0.61, 0.36, 1);

    --mp-radius-sm: 10px;
    --mp-radius-md: 14px;
    --mp-radius-lg: 18px;
    --mp-radius-xl: 24px;

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
    --mp-btn-dark-bg: #141c26;
    --mp-btn-dark-bg-hover: #2a3644;
    --mp-btn-light-bg: #fff;
    --mp-btn-light-bg-hover: #fff;
    --mp-btn-light-border: rgba(27, 38, 50, 0.16);
    --mp-btn-light-border-hover: rgba(27, 38, 50, 0.32);
    --mp-btn-font-weight: 600;
    /* Liens texte dans le contenu */
    --mp-link: var(--mp-purple);
    --mp-link-hover: var(--mp-purple-hover);
    --mp-link-underline: rgba(101, 64, 116, 0.32);
    --mp-external-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/%3E%3Cpolyline points='15 3 21 3 21 9'/%3E%3Cline x1='10' y1='14' x2='21' y2='3'/%3E%3C/svg%3E");
    --mp-mail-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E%3Cpath d='m3 7 9 6 9-6'/%3E%3C/svg%3E");
  }

  :global(::selection) {
    background: var(--mp-orange-soft);
    color: var(--mp-ink);
  }

  :global(:focus-visible) {
    outline: 2px solid var(--mp-purple);
    outline-offset: 3px;
  }

  :global(img) {
    max-width: 100%;
  }

  /* Petit sur-titre éditorial au-dessus des titres. */
  :global(.mp-eyebrow) {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0 0 1rem;
    font-size: 0.75rem;
    font-weight: 650;
    letter-spacing: 0.14em;
    line-height: 1.2;
    text-transform: uppercase;
    color: var(--mp-orange-ink);
  }

  :global(.mp-eyebrow::before) {
    content: "";
    width: 1.5rem;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    opacity: 0.85;
  }

  :global(.mp-eyebrow[data-tone="light"]) {
    color: #f3b26b;
  }

  /* Liens “inline” : violet discret + soulignement (hors boutons / cartes / header) */
  :global(
      main.site-main
        a:not(.btn-dark-lg):not(.btn-dark-sm):not(.btn-light-lg):not(
          .btn-light-sm
        ):not(.cta):not(.cta-secondary):not(.brand):not(.row):not(
          .back-link
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card):not(.text-link)
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
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card):not(.text-link):hover
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
        ):not(.primary):not(.place-link):not(.instagram-handle):not(.post-card):not(.text-link):visited
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
    letter-spacing: -0.01em;
    white-space: nowrap;
    transition:
      background 0.2s var(--mp-ease),
      border-color 0.2s var(--mp-ease),
      color 0.2s var(--mp-ease),
      box-shadow 0.2s var(--mp-ease),
      transform 0.2s var(--mp-ease);
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
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 1px 2px rgba(20, 28, 38, 0.18);
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
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 8px 18px -8px rgba(20, 28, 38, 0.45);
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
    box-shadow: var(--mp-shadow-sm);
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
    transform: translateY(-1px);
    box-shadow: 0 8px 18px -10px rgba(20, 28, 38, 0.3);
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
    padding: 0.85rem 1.5rem;
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
    font-size: clamp(2.4rem, 4.4vw, 3.5rem);
    font-weight: 700;
    line-height: 1.04;
    margin-bottom: 1.5rem;
    color: var(--mp-ink);
    letter-spacing: -0.035em;
    font-optical-sizing: auto;
    text-wrap: balance;
  }

  :global(h2),
  :global(h3) {
    font-family: var(--mp-font-serif);
    color: var(--mp-ink);
    letter-spacing: -0.025em;
    font-optical-sizing: auto;
    text-wrap: balance;
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
    background: transparent;
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
    padding: 3rem var(--mp-shell-pad-x) 5.5rem;
    box-sizing: border-box;
  }

  :global(.content-head) {
    margin: 0 0 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--mp-line);
  }

  :global(.content-head > h1) {
    margin: 0 0 0.85rem;
  }

  :global(.content-intro) {
    margin: 0;
    max-width: 60ch;
    color: var(--mp-muted);
    font-size: 1.125rem;
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
    gap: 0.45rem 1rem;
    padding: 1.4rem 1.5rem;
    border-radius: var(--mp-radius-lg);
    border: 1px solid var(--mp-line);
    background: var(--mp-surface);
    box-shadow: var(--mp-shadow-sm);
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.2s var(--mp-ease),
      box-shadow 0.2s var(--mp-ease),
      transform 0.2s var(--mp-ease);
  }

  :global(.content-list .row:hover) {
    border-color: rgba(101, 64, 116, 0.28);
    box-shadow: var(--mp-shadow-md);
    transform: translateY(-2px);
  }

  :global(.content-list .row:hover .arrow) {
    transform: translateX(3px);
  }

  :global(.content-list .row:focus-visible) {
    outline: 2px solid var(--mp-purple);
    outline-offset: 2px;
  }

  :global(.content-list .row .label) {
    grid-column: 1;
    font-size: 1.05rem;
    font-weight: 650;
    line-height: 1.35;
    letter-spacing: -0.015em;
    color: var(--mp-ink);
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
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--mp-muted);
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
    transition: transform 0.2s var(--mp-ease);
  }

  /* Encart CTA commun (fond teinté, sans bordure) */
  /* Encart CTA aligné sur la box "Organisateurs" (page Conférences). */
  :global(.content-cta) {
    margin: 2.5rem 0 0;
    padding: 1.75rem;
    border-radius: var(--mp-radius-xl);
    border: none;
    background: var(--mp-night);
    color: #fff;
    box-shadow: var(--mp-shadow-lg);
    box-sizing: border-box;
  }

  :global(.content-cta > h2) {
    margin: 0 0 0.6rem;
    font-size: 1.35rem;
    line-height: 1.2;
    color: #fff;
  }

  :global(.content-cta .content-cta-text) {
    margin: 0 0 1.35rem;
    max-width: 60ch;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  /* Bouton principal dans un encart sombre : passe en clair. */
  :global(.content-cta .cta) {
    background: #fff;
    color: var(--mp-ink);
    border-color: #fff;
  }

  :global(.content-cta .cta:hover) {
    background: var(--mp-orange-soft);
    border-color: var(--mp-orange-soft);
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
