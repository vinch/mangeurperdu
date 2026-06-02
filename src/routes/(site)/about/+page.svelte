<script lang="ts">
  import EmailLink from "$lib/components/EmailLink.svelte";

  const contactSubject = "Contact — Mangeur Perdu";
</script>

<svelte:head>
  <title>À propos — Mangeur Perdu</title>
  <meta
    name="description"
    content="Vincent Battaglia : informaticien de formation, entrepreneur tech, auteur de Mangeur Perdu, cofondateur de Rebel Food."
  />
</svelte:head>

<div class="about-page">
  <section class="about-hero" aria-label="Présentation">
    <div class="about-hero-copy">
      <h1>À propos</h1>
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
    /* Jamais rognée, toujours calée en bas à gauche. */
    background-image: url("/vinch-transparent.png");
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
  }

  .about-hero-copy {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.75rem 3rem;
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
      grid-template-columns: 1fr;
      min-height: 0;
      background-size: auto 13rem;
    }

    .about-hero-copy {
      grid-column: 1;
      justify-content: flex-start;
      padding: 1.75rem 1.5rem 14rem;
    }
  }
</style>
