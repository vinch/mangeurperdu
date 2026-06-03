<script lang="ts">
  import EmailLink from "$lib/components/EmailLink.svelte";

  const contactSubject = "Contact — Mangeur Perdu";
</script>

<svelte:head>
  <title>Qui je suis — Mangeur Perdu</title>
  <meta
    name="description"
    content="Vincent Battaglia : informaticien de formation, entrepreneur tech, auteur de Mangeur Perdu, cofondateur de Rebel Food."
  />
</svelte:head>

<div class="about-page">
  <section class="about-hero" aria-label="Présentation">
    <div class="about-hero-visual" aria-hidden="true"></div>
    <div class="about-hero-copy">
      <h1>Qui je suis</h1>
      <p class="lead">
        Vincent Battaglia est informaticien de formation, entrepreneur dans la
        tech et cofondateur de
        <a
          href="https://www.rebelfood.eu"
          target="_blank"
          rel="noopener noreferrer">Rebel Food</a
        >
        . Il s’intéresse depuis plus de dix ans aux questions de nutrition et de
        santé. À travers
        <a
          href="https://www.instagram.com/mangeurperdu/"
          target="_blank"
          rel="noopener noreferrer">@mangeurperdu</a
        >, il partage une réflexion accessible et critique sur notre
        alimentation moderne.
      </p>
      <div class="actions">
        <EmailLink
          className="cta btn-mail"
          subject={contactSubject}
          ariaLabel="Contacter Vincent Battaglia par email"
        >
          Prendre contact
        </EmailLink>
      </div>
    </div>
  </section>
</div>

<style>
  .about-page {
    width: 100%;
    max-width: var(--mp-shell-max);
    margin: 0 auto;
    padding: 0 var(--mp-shell-pad-x) 4rem;
    box-sizing: border-box;
  }

  /* —— Grand bloc jaune : photo (transparente) collée en bas à gauche, texte à droite —— */
  .about-hero {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: stretch;
    min-height: clamp(24rem, 56vh, 34rem);
    border-radius: 1.35rem;
    overflow: hidden;
    background-color: #e9be60;
  }

  /* Photo limitée à la colonne gauche : proportionnelle à la largeur, jamais rognée. */
  .about-hero-visual {
    grid-column: 1;
    grid-row: 1;
    align-self: stretch;
    min-width: 0;
    min-height: 0;
    background-image: url("/vinch-transparent.png");
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
  }

  .about-hero-copy {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.75rem 3rem 2.75rem 0;
    color: #1f2d3a;
  }

  .about-hero-copy h1 {
    margin: 0 0 1rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.15rem, 3.8vw, 3.15rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #1f2d3a;
  }

  .lead {
    margin: 0 0 1.5rem;
    color: rgba(31, 45, 58, 0.82);
    font-size: 1.125rem;
    line-height: 1.65;
    max-width: 52ch;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  @media (max-width: 720px) {
    .about-hero {
      position: relative;
      grid-template-columns: 1fr;
      min-height: 0;
    }

    .about-hero-visual {
      grid-column: 1;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 13rem;
      pointer-events: none;
    }

    .about-hero-copy {
      grid-column: 1;
      justify-content: flex-start;
      padding: 1.75rem 1.5rem 14rem;
    }

    .lead {
      margin-bottom: 0;
    }

    /* À côté du portrait (fond), dans la zone jaune libre */
    .actions {
      position: absolute;
      left: clamp(10.5rem, 34vw, 12.5rem);
      right: 1.5rem;
      bottom: 6.75rem;
      z-index: 1;
      justify-content: flex-end;
    }
  }
</style>
