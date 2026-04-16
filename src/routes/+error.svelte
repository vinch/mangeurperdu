<script>
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>
    {page.status === 404
      ? "404 — Encore perdu — Mangeur Perdu"
      : "Erreur — Mangeur Perdu"}
  </title>
</svelte:head>

<div class="error-page">
  {#if page.status === 404}
    <div class="error-card error-card-404">
      <div class="lost-visual">
        <img
          src="/logo.jpg"
          class="lost-logo"
          alt="Illustration Mangeur Perdu : personnage préhistorique et points d’interrogation"
        />
      </div>
      <p class="error-code">404</p>
      <h1>Perdu·e ? Ça tombe bien.</h1>
      <p class="tagline">
        Chez <strong>Mangeur Perdu</strong>, être un peu paumé face à
        l’alimentation moderne, c’est presque le concept.
      </p>
      <p class="error-message">
        Sauf que <em>cette</em> page, elle n’existe vraiment pas — ni ici, ni nulle
        part. Désolé.
      </p>
      <a href="/" class="back-link">← Retour à l’accueil</a>
    </div>
  {:else}
    <div class="error-card">
      <p class="error-code">{page.status}</p>
      <h1>Oups, une erreur est survenue</h1>
      <p class="error-message">
        {page.error?.message || "Veuillez réessayer plus tard."}
      </p>
      <a href="/" class="back-link">← Retour à l’accueil</a>
    </div>
  {/if}
</div>

<style>
  .error-page {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
  }

  .error-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem 2rem;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(101, 64, 116, 0.12);
  }

  .error-card-404 {
    max-width: 26rem;
    padding-top: 2rem;
    background: linear-gradient(
      165deg,
      rgba(101, 64, 116, 0.06) 0%,
      #fff 38%,
      #fff 100%
    );
  }

  .lost-visual {
    width: min(13.5rem, 72vw);
    margin: 0 auto 1rem;
    animation: drift 5s ease-in-out infinite;
  }

  .lost-logo {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
    filter: drop-shadow(0 6px 14px rgba(58, 36, 66, 0.15));
  }

  @keyframes drift {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .error-code {
    font-size: 3rem;
    font-weight: 700;
    color: #654074;
    line-height: 1;
    margin-bottom: 0.35rem;
    letter-spacing: -0.02em;
  }

  .error-card-404 .error-code {
    font-size: 2.5rem;
    opacity: 0.92;
  }

  h1 {
    font-size: 1.45rem;
    color: #2c3e50;
    margin-bottom: 0.75rem;
    line-height: 1.25;
  }

  .tagline {
    color: #4a5563;
    margin-bottom: 1rem;
    font-size: 0.98rem;
    line-height: 1.55;
  }

  .error-message {
    color: #5c6570;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .error-message em {
    font-style: italic;
    color: #654074;
  }

  .back-link {
    display: inline-block;
    color: #654074;
    font-weight: 600;
    text-decoration: none;
    padding: 0.5rem 0;
    transition: opacity 0.2s;
  }

  .back-link:hover {
    opacity: 0.85;
    text-decoration: underline;
  }

  @media (prefers-reduced-motion: reduce) {
    .lost-visual {
      animation: none;
    }
  }
</style>
