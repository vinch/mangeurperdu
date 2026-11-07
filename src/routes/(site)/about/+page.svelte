<script lang="ts">
  import EmailLink from "$lib/components/EmailLink.svelte";
  import { BOOK_RELEASE_ABOUT, BOOK_TITLE } from "$lib/book";

  const contactSubject = "Contact — Mangeur Perdu";
</script>

<svelte:head>
  <title>À propos — Mangeur Perdu</title>
  <meta
    name="description"
    content="Vincent Battaglia : informaticien de formation, entrepreneur tech, auteur de Mangeur Perdu (mars 2027, Thierry Souccar Éditions)."
  />
</svelte:head>

<div class="about-page">
  <section class="about-hero" aria-label="Présentation">
    <div class="about-hero-visual" aria-hidden="true"></div>
    <div class="about-hero-copy">
      <p class="mp-eyebrow">L’auteur</p>
      <h1>À propos</h1>
      <p class="lead">
        Vincent Battaglia est informaticien de formation et entrepreneur dans la
        tech. Il s’intéresse depuis plus de dix ans aux questions de nutrition
        et de santé. Son premier livre, <em>{BOOK_TITLE}</em>, paraît
        {BOOK_RELEASE_ABOUT}. À travers
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
    padding: 0 var(--mp-shell-pad-x) 5.5rem;
    box-sizing: border-box;
  }

  /* —— Grand bloc jaune : photo (transparente) collée en bas à gauche, texte à droite —— */
  .about-hero {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: stretch;
    min-height: clamp(26rem, 62vh, 38rem);
    border-radius: var(--mp-radius-xl);
    overflow: hidden;
    background:
      radial-gradient(
        ellipse 50% 70% at 22% 60%,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0) 70%
      ),
      linear-gradient(135deg, #f0c86e 0%, #e7b754 60%, #dca744 100%);
    box-shadow: inset 0 0 0 1px rgba(20, 28, 38, 0.05);
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
    padding: 3rem 4rem 3rem 0;
    color: var(--mp-ink);
  }

  .about-hero-copy :global(.mp-eyebrow) {
    color: rgba(20, 28, 38, 0.7);
  }

  .about-hero-copy h1 {
    margin: 0 0 1.25rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.5rem, 4.6vw, 3.9rem);
    font-weight: 750;
    line-height: 1;
    letter-spacing: -0.045em;
    color: var(--mp-ink);
  }

  .lead {
    margin: 0 0 2rem;
    color: rgba(20, 28, 38, 0.8);
    font-size: 1.15rem;
    line-height: 1.7;
    max-width: 50ch;
  }

  .lead :global(a) {
    color: var(--mp-ink) !important;
    text-decoration-color: rgba(20, 28, 38, 0.4) !important;
    font-weight: 600 !important;
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
