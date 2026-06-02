<script lang="ts">
  import FeaturedSelectionIntro from "$lib/components/featured-selection/FeaturedSelectionIntro.svelte";
  import EmailLink from "$lib/components/EmailLink.svelte";

  const collabSubject = "Proposition de collaboration — Mangeur Perdu";
  const collabBody = `Bonjour,\n\nMarque / produit :\nCatégorie :\nPays :\nLien(s) :\n\nEn 3 lignes : pourquoi c’est une alternative solide dans une catégorie dominée par l’ultra-transformé, et en quoi la composition reste saine (NOVA 3 au maximum) :\n\nInfos utiles (ingrédients, valeurs nutritionnelles, formats, disponibilité) :\n\nMerci,`;
</script>

<svelte:head>
  <title>Collaborations — Mangeur Perdu</title>
  <meta
    name="description"
    content="Une sélection restreinte de marques dont j’ai parlé publiquement — pour de bonnes raisons, et sans posture publicitaire."
  />
</svelte:head>

<div class="content-page collab">
  <div class="collab-layout">
    <div class="collab-intro">
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
          Mon idéal reste une alimentation brute ou peu transformée, proche de
          celle de nos ancêtres. Mais il ne s’agit pas de viser une perfection
          absolue. L’important, c’est d’avancer dans la bonne direction, de
          faire mieux qu’hier. Dans ce contexte, les produits présentés ici
          constituent un compromis plus que pertinent par rapport aux
          contraintes de la vie moderne.
        </p>
      </FeaturedSelectionIntro>
    </div>

    <aside class="collab-aside">
      <section class="content-cta collab-cta" aria-labelledby="collab-cta-title">
        <h2 id="collab-cta-title">Proposer une collaboration</h2>
        <p class="content-cta-text">
          Si tu penses que ton produit coche ces critères, envoie-moi un message
          et on discute.
        </p>
        <EmailLink
          className="cta btn-mail"
          subject={collabSubject}
          body={collabBody}
          ariaLabel="Proposer une collaboration par email"
        >
          Let's go
        </EmailLink>
      </section>
    </aside>
  </div>
</div>

<style>
  /* Intro à gauche, box "Proposer une collab" en haut à droite (façon Conférences). */
  .collab-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: 2.5rem;
    align-items: start;
  }

  .collab-cta {
    position: sticky;
    top: calc(96px + 1.5rem);
    margin: 0;
  }

  @media (max-width: 900px) {
    .collab-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .collab-cta {
      position: static;
      top: auto;
    }
  }
</style>
