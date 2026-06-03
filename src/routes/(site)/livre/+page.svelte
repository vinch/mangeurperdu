<script>
  import BookNotifyForm from "$lib/components/BookNotifyForm.svelte";
</script>

<svelte:head>
  <title>Mangeur Perdu — Le livre</title>
  <meta
    name="description"
    content="Pourquoi on ne sait plus comment manger. Sortie du livre Mangeur Perdu prévue au premier trimestre 2027."
  />
  <meta property="og:title" content="Mangeur Perdu — Le livre" />
  <meta
    property="og:description"
    content="Nous n’avons jamais eu autant d’informations sur l’alimentation. Et pourtant, nous n’avons jamais été aussi perdus."
  />
  <meta property="og:image" content="https://mangeurperdu.com/social.jpg" />
</svelte:head>

<div class="book-page">
  <section class="book-hero">
    <div class="book-hero-inner site-container">
      <div class="book-hero-copy">
        <h1>Mangeur Perdu</h1>
        <p class="subtitle">Pourquoi on ne sait plus comment manger</p>
        <p class="lead">
          Nous n’avons jamais eu autant d’informations sur l’alimentation. Et
          pourtant, nous n’avons jamais été aussi perdus. Un retour au bon sens,
          loin des injonctions contradictoires.
        </p>
        <p class="availability">
          <span class="availability-mark" aria-hidden="true"></span>
          Sortie prévue au premier trimestre 2027
        </p>
      </div>

      <div class="book-hero-visual">
        <img
          src="/cover-flat.png"
          alt="Couverture du livre Mangeur Perdu"
          width="520"
          height="640"
        />
      </div>
    </div>
  </section>

  <section class="book-preorder">
    <div class="book-preorder-inner site-container">
      <div class="book-preorder-copy">
        <h2>Être prévenu de la sortie</h2>
        <BookNotifyForm variant="dark" buttonLabel="S’inscrire" />
      </div>
      <div class="book-preorder-spacer" aria-hidden="true"></div>
    </div>
  </section>

  <section class="book-about">
    <div class="book-about-inner site-container">
      <div class="book-about-visual">
        <img src="/cover-3d.png" alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div class="book-about-copy">
        <h2>À propos du livre</h2>
        <p>
          Faut-il manger moins gras&nbsp;? Moins sucré&nbsp;? Compter ses
          calories&nbsp;? Supprimer des aliments&nbsp;? Suivre le dernier régime
          à la mode&nbsp;? À force d’injonctions contradictoires, une chose est
          certaine&nbsp;: nous ne savons plus comment manger.
        </p>
        <p>
          Dans <em>Mangeur Perdu</em>, Vincent Battaglia propose une autre
          approche. Pas un énième plan alimentaire, ni une méthode miracle, mais
          une tentative de retour au bon sens.
        </p>
        <p>
          À travers son parcours personnel et une exploration critique des idées
          reçues, il questionne ce que nous croyons savoir sur la nutrition.
        </p>
        <p>
          Et si le problème n’était pas un manque de discipline… mais un
          environnement qui nous éloigne, peu à peu, de notre nature&nbsp;?
        </p>
        <p>
          Ce livre n’apporte pas de réponses toutes faites. Il propose
          mieux&nbsp;: une nouvelle façon de regarder son assiette.
        </p>
        <a class="text-link" href="/about">À propos de l’auteur →</a>
      </div>
    </div>
  </section>
</div>

<style>
  .book-page {
    --header-h: 96px;
    background: #fff;
    margin-top: calc(var(--header-h) * -1);
  }

  /* —— Hero (inspiration Huberman / Protocols) —— */
  .book-hero {
    position: relative;
    z-index: 2;
    background: linear-gradient(135deg, #f6efe4 0%, #e8d5c4 42%, #c9a882 100%);
    padding: calc(var(--header-h) + 1.25rem) 0 0;
  }

  .book-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: stretch;
  }

  .book-hero-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    color: #1f2d3a;
  }

  .book-hero-copy h1 {
    margin: 0 0 0.5rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.75rem, 5vw, 4.25rem);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.03em;
  }

  .subtitle {
    margin: 0 0 1.25rem;
    font-size: clamp(1.45rem, 2.6vw, 2rem);
    font-weight: 600;
    line-height: 1.2;
    opacity: 0.92;
  }

  .availability {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin: 0.35rem 0 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1f2d3a;
  }

  .availability-mark {
    width: 3px;
    height: 1.5rem;
    border-radius: 2px;
    background: var(--mp-purple, #654074);
    flex-shrink: 0;
  }

  .lead {
    margin: 0 0 1.5rem;
    max-width: 40ch;
    font-size: 1.05rem;
    line-height: 1.6;
    opacity: 0.88;
  }

  .book-hero-visual {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .book-hero-visual img {
    display: block;
    width: auto;
    max-width: min(100%, 32rem);
    height: auto;
    object-fit: contain;
    /* Ombre douce sous la couverture (inspiration Huberman / Protocols) */
    filter: drop-shadow(0 30px 45px rgba(40, 28, 14, 0.32));
    /* Le livre déborde dans la section sombre en dessous */
    margin-bottom: -10rem;
  }

  /* —— Bandeau sombre : inscription —— */
  .book-preorder {
    position: relative;
    z-index: 1;
    background: #1a2330;
    color: #fff;
    padding: 4rem 0 4.5rem;
  }

  .book-preorder-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .book-preorder-copy {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 0.5rem;
  }

  .book-preorder-copy h2 {
    margin: 0;
    font-family: var(--mp-font-sans);
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #fff;
  }

  /* —— Corps —— */
  .book-about {
    position: relative;
    z-index: 2;
    padding: 4.5rem 0;
    background: #fff;
  }

  .book-about-inner {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) 1fr;
    gap: 3.5rem;
    align-items: start;
  }

  .book-about-visual {
    position: relative;
  }

  .book-about-visual img {
    display: block;
    width: min(100%, 24rem);
    height: auto;
    margin-top: 0;
  }

  .book-about-copy h2 {
    margin: 0 0 1.25rem;
    font-family: var(--mp-font-sans);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #1f2d3a;
  }

  .book-about-copy p {
    margin: 0 0 1.1rem;
    color: var(--mp-muted, rgba(31, 45, 58, 0.72));
    line-height: 1.65;
    max-width: 62ch;
  }

  .text-link {
    display: inline-block;
    margin-top: 0.5rem;
    font-weight: 600;
    color: var(--mp-purple, #654074);
    text-decoration: none;
  }

  .text-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 960px) {
    .book-hero-inner {
      grid-template-columns: 1fr;
      min-height: 0;
      text-align: left;
    }

    .book-hero-inner {
      gap: 3rem;
    }

    .book-hero-visual {
      order: -1;
      align-items: center;
      justify-content: center;
    }

    .book-hero-visual img {
      max-width: min(80vw, 22rem);
      margin-bottom: 0;
    }

    .book-hero-copy {
      justify-content: flex-start;
      padding: 0 0 2.5rem;
    }

    .book-preorder {
      padding: 2.75rem 0 3.25rem;
    }

    .book-preorder-inner {
      grid-template-columns: 1fr;
    }

    .book-preorder-copy {
      gap: 1rem;
    }

    .book-preorder-spacer {
      display: none;
    }

    .book-about-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .book-about-visual {
      display: none;
    }
  }
</style>
