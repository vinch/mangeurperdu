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

<div class="page about mp-prose">
  <h1>À propos</h1>

  <section class="about-panel" aria-label="Présentation">
    <div class="about-body">
      <figure class="about-photo">
        <img
          src="/vinch.png"
          alt="Vincent Battaglia"
          class="about-img"
          width="176"
          height="176"
        />
      </figure>

      <div class="about-copy">
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
            rel="noopener noreferrer"><em>@mangeurperdu</em></a
          >, il partage une réflexion accessible et critique sur notre
          alimentation moderne.
        </p>
        <div class="actions">
          <EmailLink
            className="cta"
            subject={contactSubject}
            ariaLabel="Contacter Vincent Battaglia par email"
          >
            Prendre contact →
          </EmailLink>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .about h1 {
    margin-bottom: 1.5rem;
  }

  /* Même socle que `.organizer-cta` (page Conférences) */
  .about-panel {
    width: 100%;
    padding: 1.25rem 1.25rem 1.35rem;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(101, 64, 116, 0.04);
    box-sizing: border-box;
  }

  .about-panel :global(.cta) {
    margin-top: 0;
  }

  .about-body {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem 2rem;
    align-items: start;
  }

  .about-photo {
    margin: 0;
    width: 11rem;
    height: 11rem;
    flex-shrink: 0;
  }

  .about-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid rgba(101, 64, 116, 0.2);
    box-shadow: 0 6px 20px rgba(58, 36, 66, 0.12);
  }

  .lead {
    margin: 0 0 1.25rem;
    color: #56616b;
    line-height: 1.65;
    max-width: 65ch;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  @media (max-width: 700px) {
    .about-body {
      grid-template-columns: 1fr;
    }

    .about-photo {
      justify-self: start;
    }
  }
</style>
