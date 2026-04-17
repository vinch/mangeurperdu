<script lang="ts">
  import FeaturedSelectionIntro from "$lib/components/featured-selection/FeaturedSelectionIntro.svelte";
  import EmailLink from "$lib/components/EmailLink.svelte";

  type FeaturedBrand = {
    slug: string;
    name: string;
    logo_url: string | null;
    website_url: string | null;
    short_description: string | null;
    long_description: string | null;
    instagram_reel_url: string | null;
  };

  type CollabPageData = { brands: FeaturedBrand[]; loadError: string | null };

  let { data }: { data: CollabPageData } = $props();

  let selected = $state<FeaturedBrand | null>(null);

  const collabSubject = "Proposition de collaboration — Mangeur Perdu";
  const collabBody = `Bonjour,\n\nMarque / produit :\nCatégorie :\nPays :\nLien(s) :\n\nEn 3 lignes : pourquoi c’est une alternative solide dans une catégorie dominée par l’ultra-transformé, et en quoi la composition reste saine (NOVA 3 au maximum) :\n\nInfos utiles (ingrédients, valeurs nutritionnelles, formats, disponibilité) :\n\nMerci,`;

  function cleanUrl(url: string | null): string | null {
    const u = (url ?? "").trim();
    return u ? u : null;
  }

  function openBrand(item: FeaturedBrand) {
    selected = item;
  }

  function closeModal() {
    selected = null;
  }

  $effect(() => {
    if (!selected || typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
</script>

<svelte:head>
  <title>Collaborations — Mangeur Perdu</title>
  <meta
    name="description"
    content="Une sélection restreinte de marques dont j’ai parlé publiquement — pour de bonnes raisons, et sans posture publicitaire."
  />
</svelte:head>

<div class="page collab">
  <FeaturedSelectionIntro
    title="Collaborations"
    subtitle="Une sélection restreinte, choisie à la main."
  >
    <p>
      Je suis sélectif dans les marques avec qui je travaille et que je cite
      ici.
    </p>
    <p>
      Le fil conducteur : proposer une alternative solide dans une catégorie
      dominée par l’ultra-transformé, avec une composition saine et des
      ingrédients aussi simples que possible (NOVA 3 au maximum).
    </p>
    <p>
      Mon idéal reste une alimentation brute ou peu transformée, proche de celle
      de nos ancêtres. Mais il ne s’agit pas de viser une perfection absolue.
      L’important, c’est d’avancer dans la bonne direction, de faire mieux
      qu’hier. Dans ce contexte, les produits présentés ici constituent un
      compromis plus que pertinent par rapport aux contraintes de la vie
      moderne.
    </p>
  </FeaturedSelectionIntro>

  {#if data.loadError}
    <p class="error">{data.loadError}</p>
  {:else}
    <section aria-label="Logos des marques">
      {#if data.brands.length === 0}
        <p class="empty">Rien à afficher pour le moment.</p>
      {:else}
        <ul class="logo-grid">
          {#each data.brands as item (item.slug)}
            <li>
              <button
                type="button"
                class="logo-tile"
                onclick={() => openBrand(item)}
                aria-label={"Ouvrir : " + item.name}
              >
                <span class="logo-frame">
                  {#if item.logo_url}
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      loading="lazy"
                      class="logo-img"
                    />
                  {:else}
                    <span class="logo-fallback" aria-hidden="true"
                      >{item.name.slice(0, 1).toUpperCase()}</span
                    >
                  {/if}
                </span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}

  <section class="collab-cta" aria-labelledby="collab-cta-title">
    <h2 id="collab-cta-title">Proposer une collaboration</h2>
    <p class="collab-cta-text">
      Si tu penses que ton produit coche ces critères, envoie-moi un message et
      on discute.
    </p>
    <EmailLink
      className="cta"
      subject={collabSubject}
      body={collabBody}
      ariaLabel="Proposer une collaboration par email"
    >
      Let's go →
    </EmailLink>
  </section>
</div>

{#if selected}
  {@const websiteUrl = cleanUrl(selected.website_url)}
  {@const reelUrl = cleanUrl(selected.instagram_reel_url)}
  {@const text =
    selected.long_description?.trim() ||
    selected.short_description?.trim() ||
    ""}

  <div class="modal" role="dialog" aria-modal="true" aria-label={selected.name}>
    <button
      class="backdrop"
      type="button"
      aria-label="Fermer"
      onclick={closeModal}
    ></button>
    <div class="modal-card" role="document">
      <div class="modal-header">
        <div class="modal-titleRow">
          <h2 class="modal-title">{selected.name}</h2>
        </div>
        <button
          class="modal-close"
          type="button"
          onclick={closeModal}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {#if selected.short_description}
        <p class="modal-kicker">{selected.short_description}</p>
      {/if}

      {#if text}
        <p class="modal-body">{text}</p>
      {/if}

      <div class="modal-actions" aria-label="Liens externes">
        {#if websiteUrl}
          <a
            class="cta-secondary"
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer">Visiter le site →</a
          >
        {/if}
        {#if reelUrl}
          <a
            class="cta-secondary"
            href={reelUrl}
            target="_blank"
            rel="noopener noreferrer">Reel</a
          >
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .collab-cta {
    width: 100%;
    max-width: min(32rem, 100%);
    margin: 2.5rem auto 0;
    padding: 1rem 1.15rem 1.15rem;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(101, 64, 116, 0.04);
    box-sizing: border-box;
  }

  .collab-cta h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    color: var(--mp-text);
  }

  .collab-cta-text {
    margin: 0 0 0.75rem;
    color: var(--mp-muted);
    font-size: 0.95rem;
    line-height: 1.45;
    max-width: 75ch;
  }

  .error {
    margin-top: 1rem;
    color: #8b0000;
    font-weight: 650;
  }

  .empty {
    margin-top: 1rem;
    color: var(--mp-muted);
  }

  .logo-grid {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .logo-tile {
    all: unset;
    width: 100%;
    display: block;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 16px;
  }

  .logo-frame {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.06);
    padding: 1.25rem;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease,
      border-color 0.12s ease;
  }

  /* Pas d'effet "rollover" sur le contenu du logo (certains logos sont circulaires). */
  .logo-tile:hover .logo-frame {
    border-color: rgba(101, 64, 116, 0.22);
    box-shadow: 0 14px 46px rgba(0, 0, 0, 0.08);
    transform: none;
  }

  .logo-tile:focus-visible .logo-frame {
    border-color: rgba(101, 64, 116, 0.3);
    box-shadow: 0 14px 46px rgba(0, 0, 0, 0.09);
    transform: none;
  }

  .logo-tile:focus-visible {
    outline: 2px solid rgba(101, 64, 116, 0.35);
    outline-offset: 4px;
    border-radius: 18px;
  }

  .logo-img {
    display: block;
    max-width: 78%;
    max-height: 78%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .logo-fallback {
    font-weight: 850;
    font-size: 2.1rem;
    color: rgba(44, 62, 80, 0.7);
  }

  .modal {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: 1.25rem;
  }

  .backdrop {
    all: unset;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    cursor: pointer;
  }

  .modal-card {
    position: relative;
    width: min(760px, 100%);
    max-height: min(82vh, 860px);
    overflow: auto;
    border-radius: 18px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.28);
    padding: 1.15rem 1.15rem 1.1rem;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.6rem;
  }

  .modal-titleRow {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .modal-title {
    margin: 0;
    font-size: 2rem;
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: var(--mp-text);
    font-weight: 850;
  }

  .modal-close {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.9);
    width: 42px;
    height: 42px;
    border-radius: 999px;
    padding: 0;
    font-size: 1rem;
    color: rgba(44, 62, 80, 0.85);
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.1s ease;
  }

  .modal-close:hover {
    background: rgba(101, 64, 116, 0.06);
    border-color: rgba(101, 64, 116, 0.22);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }

  .modal-close:active {
    transform: translateY(0.5px);
  }

  .modal-close:focus-visible {
    outline: 2px solid rgba(101, 64, 116, 0.35);
    outline-offset: 3px;
  }

  .modal-kicker {
    margin: 0 0 0.85rem;
    color: rgba(86, 97, 107, 0.95);
    font-weight: 650;
    line-height: 1.4;
  }

  .modal-body {
    margin: 0 0 1rem;
    color: var(--mp-muted);
    line-height: 1.6;
    white-space: pre-line;
  }

  .modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }

  @media (max-width: 820px) {
    .logo-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .logo-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
