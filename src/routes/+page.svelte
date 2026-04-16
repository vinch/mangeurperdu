<script>
  let email = $state("");
  let submitting = $state(false);

  const SUPABASE_SAVE_EMAIL_URL =
    "https://apgydbcrmczqisjjgttx.supabase.co/functions/v1/save-email-mangeurperdu";

  async function handleSubmit() {
    submitting = true;
    try {
      const response = await fetch(SUPABASE_SAVE_EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert(
          "Merci pour votre intérêt ! Nous vous notifierons dès que le livre sera disponible.",
        );
        email = "";
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (err) {
      alert("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Mangeur Perdu — Septembre 2026</title>
  <meta
    name="description"
    content="Nous n’avons jamais eu autant d’informations sur l’alimentation. Et pourtant, nous n’avons jamais été aussi perdus. Sortie du livre prévue en septembre 2026."
  />
  <meta
    name="keywords"
    content="livre, mangeur perdu, alimentation, santé, nutrition"
  />
  <meta name="author" content="Mangeur Perdu" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mangeurperdu.com/" />
  <meta property="og:title" content="Mangeur Perdu" />
  <meta
    property="og:description"
    content="Nous n’avons jamais eu autant d’informations sur l’alimentation. Et pourtant, nous n’avons jamais été aussi perdus. Sortie du livre prévue en septembre 2026."
  />
  <meta property="og:image" content="https://mangeurperdu.com/social.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Mangeur Perdu" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://mangeurperdu.com/" />
  <meta property="twitter:title" content="Mangeur Perdu" />
  <meta
    property="twitter:description"
    content="Nous n’avons jamais eu autant d’informations sur l’alimentation. Et pourtant, nous n’avons jamais été aussi perdus. Sortie du livre prévue en septembre 2026."
  />
  <meta
    property="twitter:image"
    content="https://mangeurperdu.com/social.jpg"
  />
</svelte:head>

<div class="home">
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="badge">Sortie du livre prévue en septembre 2026</p>
        <h1>Mangeur Perdu</h1>
        <p class="subtitle subtitle-2">
          Pourquoi on ne sait plus comment manger
        </p>
        <p class="subtitle">
          Laissez votre email pour être prévenu des nouveautés et des prochaines
          annonces de <strong>Mangeur Perdu</strong>.
        </p>

        <div class="hero-cta">
          <form
            class="notify"
            onsubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="email"
              bind:value={email}
              placeholder="Votre adresse email pour être notifié"
              required
              disabled={submitting}
              aria-label="Adresse email"
            />
            <button type="submit" disabled={submitting}>Me notifier</button>
          </form>
          {#if submitting}
            <p class="subtle">Envoi en cours…</p>
          {/if}
        </div>
      </div>

      <div class="hero-visual">
        <img
          class="cover-image"
          src="/cover-3d.png"
          alt="Représentation 3D de la couverture du livre Mangeur Perdu"
          loading="eager"
        />
      </div>
    </div>
  </section>

  <section class="section section-light about-book">
    <div class="section-inner">
      <h2>À propos du livre</h2>
      <p>
        Nous n’avons jamais eu autant d’informations sur l’alimentation. Et
        pourtant, nous n’avons jamais été aussi perdus.
      </p>
      <p>
        Faut-il manger moins gras&nbsp;? Moins sucré&nbsp;? Compter ses
        calories&nbsp;? Supprimer des aliments&nbsp;? Suivre le dernier régime à
        la mode&nbsp;? À force d’injonctions contradictoires, une chose est
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
    </div>
  </section>

  <section class="section rebel">
    <div class="section-inner">
      <div class="rebel-grid">
        <img
          class="rebel-logo"
          src="/logo-rebel-food-white.png"
          alt="Rebel Food"
          loading="lazy"
        />

        <div class="rebel-copy">
          <h2>Une app pour changer durablement</h2>
          <p>
            Rebel Food est mon app de changement d’habitudes&nbsp;: simple,
            progressive, et conçue pour tenir dans la vraie vie.
          </p>
          <div class="rebel-actions">
            <a
              class="primary"
              href="https://www.rebelfood.eu"
              target="_blank"
              rel="noopener noreferrer">Découvrir Rebel Food →</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .home {
    min-height: 100vh;
  }

  .hero {
    padding: 5rem 1.25rem 3.5rem;
    background: #f3eadb;
  }

  .hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 5rem;
    align-items: center;
  }

  .badge {
    display: inline-flex;
    width: fit-content;
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    font-weight: 650;
    font-size: 0.9rem;
    color: #654074;
    background: rgba(101, 64, 116, 0.08);
    border: 1px solid rgba(101, 64, 116, 0.18);
    margin-bottom: 0.9rem;
  }

  h1 {
    color: #2c3e50;
    font-size: clamp(2.2rem, 3.2vw, 3.2rem);
    line-height: 1.05;
    margin-bottom: 1rem;
  }

  .subtitle {
    color: #56616b;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    max-width: 55ch;
  }

  .subtitle-2 {
    margin-top: -0.25rem;
    margin-bottom: 0.85rem;
    font-weight: 750;
    letter-spacing: -0.01em;
  }

  .notify {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .notify input[type="email"] {
    min-width: 260px;
    flex: 1;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.85);
    color: #2c3e50;
  }

  .notify input::placeholder {
    color: rgba(44, 62, 80, 0.6);
  }

  .subtle {
    margin-top: 0.6rem;
    color: rgba(86, 97, 107, 0.95);
    font-size: 0.95rem;
  }

  .hero-visual {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .cover-image {
    display: block;
    width: min(520px, 100%);
    height: auto;
    filter: drop-shadow(0 30px 80px rgba(0, 0, 0, 0.22));
  }

  .section {
    padding: 4rem 1.25rem;
  }

  .section-inner {
    max-width: var(--mp-content-max, 52rem);
    margin: 0 auto;
    box-sizing: border-box;
  }

  .section-light {
    background: white;
  }

  .section h2 {
    color: #2c3e50;
    font-size: 1.9rem;
    margin-bottom: 0.75rem;
  }

  .section p {
    color: #56616b;
    max-width: 75ch;
    margin-bottom: 1.5rem;
  }

  .about-book p {
    max-width: none;
  }

  .rebel {
    background: #654074;
  }

  .rebel-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 5rem;
    align-items: center;
  }

  .rebel-copy h2 {
    color: white;
  }

  .rebel-copy p {
    color: rgba(255, 255, 255, 0.82);
  }

  .rebel-logo {
    width: min(240px, 40vw);
    height: auto;
    display: block;
  }

  .rebel-copy {
    justify-self: end;
    text-align: right;
    max-width: 60ch;
  }

  .rebel-actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 900px) {
    .rebel-grid {
      grid-template-columns: 1fr;
      justify-items: start;
      gap: 1.25rem;
    }
    .rebel-copy {
      justify-self: start;
      text-align: left;
      max-width: 75ch;
    }
    .rebel-actions {
      justify-content: flex-start;
    }
    .rebel-logo {
      width: min(320px, 100%);
    }
  }

  .primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--mp-btn-pad-y) var(--mp-btn-pad-x);
    border-radius: var(--mp-btn-radius);
    text-decoration: none;
    font-weight: var(--mp-btn-font-weight);
    font-size: var(--mp-btn-font-size);
    background: white;
    color: var(--mp-purple-900);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: background 0.2s ease;
  }

  .primary:hover {
    background: rgba(255, 255, 255, 0.92);
  }

  @media (max-width: 900px) {
    .hero-inner {
      grid-template-columns: 1fr;
    }
    .hero {
      padding-top: 3.5rem;
    }
  }
</style>
