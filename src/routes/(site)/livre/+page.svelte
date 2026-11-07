<script>
  import BookNotifyForm from "$lib/components/BookNotifyForm.svelte";
  import {
    BOOK_META_DESCRIPTION,
    BOOK_PUBLISHER,
    BOOK_PUBLISHER_LOGO,
    BOOK_PUBLISHER_URL,
    BOOK_RELEASE_FULL,
    BOOK_RELEASE_MONTH,
    BOOK_RELEASE_SHORT,
  } from "$lib/book";
</script>

<svelte:head>
  <title>Mangeur Perdu — Le livre</title>
  <meta name="description" content={BOOK_META_DESCRIPTION} />
  <meta property="og:title" content="Mangeur Perdu — Le livre" />
  <meta
    property="og:description"
    content="Nous n’avons jamais eu autant d’informations sur l’alimentation. Et pourtant, nous n’avons jamais été aussi perdus. {BOOK_RELEASE_FULL}."
  />
  <meta property="og:image" content="https://mangeurperdu.com/social.jpg" />
</svelte:head>

<div class="book-page">
  <section class="book-hero">
    <div class="book-hero-inner site-container">
      <div class="book-hero-copy">
        <p class="mp-eyebrow">Le livre</p>
        <h1>Mangeur Perdu</h1>
        <p class="subtitle">Pourquoi on ne sait plus comment manger</p>
        <p class="lead">
          Nous n’avons jamais eu autant d’informations sur l’alimentation. Et
          pourtant, nous n’avons jamais été aussi perdus. Un retour au bon sens,
          loin des injonctions contradictoires.
        </p>
        <p class="availability">
          <span class="availability-mark" aria-hidden="true"></span>
          {BOOK_RELEASE_SHORT}
        </p>
        <p class="publisher">
          <a
            class="publisher-link"
            href={BOOK_PUBLISHER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={BOOK_PUBLISHER_LOGO}
              alt={BOOK_PUBLISHER}
              width="180"
              height="48"
              loading="eager"
            />
          </a>
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
        <div class="book-preorder-head">
          <h2>Être prévenu de la sortie</h2>
          <p>Recevez un email dès que le livre est disponible.</p>
        </div>
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
        <p class="mp-eyebrow">Présentation</p>
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
        <blockquote class="pull-quote">
          Et si le problème n’était pas un manque de discipline… mais un
          environnement qui nous éloigne, peu à peu, de notre nature&nbsp;?
        </blockquote>
        <p>
          Ce livre n’apporte pas de réponses toutes faites. Il propose
          mieux&nbsp;: une nouvelle façon de regarder son assiette.
        </p>
        <dl class="book-facts">
          <div>
            <dt>Parution</dt>
            <dd>{BOOK_RELEASE_MONTH}</dd>
          </div>
          <div>
            <dt>Éditeur</dt>
            <dd>{BOOK_PUBLISHER}</dd>
          </div>
          <div>
            <dt>Auteur</dt>
            <dd>Vincent Battaglia</dd>
          </div>
        </dl>
        <a class="text-link" href="/about">À propos de l’auteur <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</div>

<style>
  .book-page {
    --header-h: 96px;
    background: var(--mp-bg);
    margin-top: calc(var(--header-h) * -1);
  }

  /* —— Hero (inspiration Huberman / Protocols) —— */
  .book-hero {
    position: relative;
    z-index: 2;
    background:
      radial-gradient(
        ellipse 45% 65% at 76% 55%,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0) 70%
      ),
      linear-gradient(135deg, #f8f1e6 0%, #ecdccb 45%, #d6b48c 100%);
    padding: calc(var(--header-h) + 2.5rem) 0 0;
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
    padding-bottom: 3rem;
    color: var(--mp-ink);
  }

  .book-hero-copy h1 {
    margin: 0 0 0.75rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 750;
    line-height: 0.98;
    letter-spacing: -0.05em;
  }

  .subtitle {
    margin: 0 0 1.5rem;
    max-width: 18ch;
    font-size: clamp(1.4rem, 2.4vw, 1.9rem);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: rgba(20, 28, 38, 0.78);
    text-wrap: balance;
  }

  .availability {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin: 0.35rem 0 0;
    font-size: 1rem;
    font-weight: 650;
    color: var(--mp-ink);
  }

  .publisher {
    margin: 2rem 0 0;
  }

  .publisher-link {
    display: inline-block;
    text-decoration: none;
    opacity: 0.92;
    transition: opacity 0.15s ease;
  }

  .publisher-link:hover {
    opacity: 1;
  }

  .publisher-link img {
    display: block;
    width: auto;
    height: 3.25rem;
  }

  .availability-mark {
    position: relative;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--mp-orange);
    flex-shrink: 0;
    box-shadow: 0 0 0 4px rgba(210, 112, 15, 0.18);
  }

  .lead {
    margin: 0 0 1.75rem;
    max-width: 40ch;
    font-size: 1.1rem;
    line-height: 1.65;
    color: rgba(20, 28, 38, 0.72);
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
    max-width: min(100%, 28rem);
    height: auto;
    object-fit: contain;
    border-radius: 3px 6px 6px 3px;
    /* Ombre douce sous la couverture (inspiration Huberman / Protocols) */
    box-shadow:
      inset 4px 0 6px -2px rgba(0, 0, 0, 0.18),
      0 2px 4px rgba(40, 28, 14, 0.12),
      0 40px 70px -20px rgba(40, 28, 14, 0.5);
    /* Le livre déborde dans la section sombre en dessous */
    margin-bottom: -10rem;
  }

  /* —— Bandeau sombre : inscription —— */
  .book-preorder {
    position: relative;
    z-index: 1;
    background:
      radial-gradient(
        ellipse 40% 90% at 15% 100%,
        rgba(210, 112, 15, 0.14) 0%,
        rgba(210, 112, 15, 0) 70%
      ),
      var(--mp-night);
    color: #fff;
    padding: 4.5rem 0 5rem;
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
    font-size: clamp(1.6rem, 3vw, 2.25rem);
    font-weight: 750;
    line-height: 1.1;
    letter-spacing: -0.035em;
    color: #fff;
  }

  .book-preorder-head p {
    margin: 0.6rem 0 0;
    color: rgba(255, 255, 255, 0.66);
    font-size: 1rem;
  }

  /* —— Corps —— */
  .book-about {
    position: relative;
    z-index: 2;
    padding: 6rem 0 6.5rem;
    background: var(--mp-bg);
  }

  .book-about-inner {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) 1fr;
    gap: 4.5rem;
    align-items: start;
  }

  .book-about-visual {
    position: sticky;
    top: 7rem;
  }

  .book-about-visual img {
    display: block;
    width: min(100%, 24rem);
    height: auto;
    margin-top: 0;
    filter: drop-shadow(0 30px 40px rgba(90, 50, 10, 0.2));
  }

  .book-about-copy h2 {
    margin: 0 0 1.75rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2rem, 3.4vw, 2.75rem);
    font-weight: 750;
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: var(--mp-ink);
  }

  .book-about-copy p:not(.mp-eyebrow) {
    margin: 0 0 1.2rem;
    color: var(--mp-muted);
    font-size: 1.075rem;
    line-height: 1.7;
    max-width: 60ch;
  }

  .book-about-copy > h2 + p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: var(--mp-text);
  }

  .pull-quote {
    margin: 2rem 0;
    padding: 0.25rem 0 0.25rem 1.5rem;
    max-width: 30ch;
    border-left: 3px solid var(--mp-orange);
    font-size: clamp(1.35rem, 2.2vw, 1.7rem);
    font-weight: 650;
    line-height: 1.3;
    letter-spacing: -0.03em;
    color: var(--mp-ink);
    text-wrap: balance;
  }

  .book-facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 2.25rem 0 1.75rem;
    max-width: 40rem;
    border-top: 1px solid var(--mp-line);
    border-bottom: 1px solid var(--mp-line);
  }

  .book-facts > div {
    padding: 1.1rem 1rem 1.1rem 0;
  }

  .book-facts > div + div {
    padding-left: 1.25rem;
    border-left: 1px solid var(--mp-line);
  }

  .book-facts dt {
    margin: 0 0 0.3rem;
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mp-subtle);
  }

  .book-facts dd {
    margin: 0;
    font-size: 0.98rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--mp-ink);
  }

  .book-facts dd::first-letter {
    text-transform: uppercase;
  }

  .text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.25rem;
    font-weight: 600;
    color: var(--mp-purple, #654074);
    text-decoration: none;
  }

  .text-link span {
    transition: transform 0.2s var(--mp-ease);
  }

  .text-link:hover span {
    transform: translateX(3px);
  }

  @media (max-width: 820px) {
    .book-page {
      --header-h: 72px;
    }
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
      padding: 0 0 3rem;
    }

    .book-hero {
      padding-top: calc(var(--header-h) + 1.5rem);
    }

    .book-about {
      padding: 4rem 0;
    }

    .book-facts {
      grid-template-columns: 1fr;
    }

    .book-facts > div + div {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid var(--mp-line);
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
