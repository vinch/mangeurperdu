<script>
  let email = $state("");
  let submitting = $state(false);

  const SUPABASE_SAVE_EMAIL_URL =
    "https://apgydbcrmczqisjjgttx.supabase.co/functions/v1/save-email";

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
          "Merci pour votre intérêt ! Nous vous notifierons dès que le livre sera disponible."
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
  <title>L'homme qui ne savait plus manger</title>
  <meta
    name="description"
    content="Le livre arrive bientôt ! Soyez les premiers au courant. Inscrivez-vous pour recevoir une alerte exclusive dès sa sortie."
  />
  <meta
    name="keywords"
    content="livre, mangeur perdu, alimentation, santé, nutrition"
  />
  <meta name="author" content="Mangeur Perdu" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mangeurperdu.com/" />
  <meta property="og:title" content="L'homme qui ne savait plus manger" />
  <meta
    property="og:description"
    content="Le livre arrive bientôt ! Soyez les premiers au courant. Inscrivez-vous pour recevoir une alerte exclusive dès sa sortie."
  />
  <meta property="og:image" content="https://mangeurperdu.com/social.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Mangeur Perdu" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://mangeurperdu.com/" />
  <meta property="twitter:title" content="L'homme qui ne savait plus manger" />
  <meta
    property="twitter:description"
    content="Le livre arrive bientôt ! Soyez les premiers au courant. Inscrivez-vous pour recevoir une alerte exclusive dès sa sortie."
  />
  <meta
    property="twitter:image"
    content="https://mangeurperdu.com/social.jpg"
  />
</svelte:head>

<div class="container">
  <div class="book-image">
    <img src="/mockup.jpg" alt="Couverture du livre" />
  </div>
  <div class="signup-form">
    <div class="placeholder">&nbsp;</div>
    <div class="signup-form-content">
      <h1>Bientôt disponible&nbsp;!</h1>
      <p>
        <strong>Le livre arrive bientôt ! Soyez les premiers au courant.</strong
        ><br />
        Inscrivez-vous pour recevoir une alerte exclusive dès sa sortie.
      </p>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div class="form-group">
          <input
            type="email"
            bind:value={email}
            placeholder="Votre adresse email"
            required
            disabled={submitting}
          />
        </div>
        <div class="form-actions">
          <button type="submit" disabled={submitting}> Me notifier </button>
          {#if submitting}
            <span class="loading" aria-hidden="true">
              <span class="spinner"></span>
              Envoi en cours…
            </span>
          {/if}
        </div>
      </form>
    </div>

    <div class="social-links">
      <a
        href="https://www.instagram.com/mangeurperdu"
        target="_blank"
        rel="noopener noreferrer"
        class="instagram"
      >
        <svg
          fill="currentColor"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"
          />
          <path
            d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"
          />
        </svg>
        Instagram
      </a>
      <a
        href="https://www.youtube.com/@mangeurperdu"
        target="_blank"
        rel="noopener noreferrer"
        class="youtube"
      >
        <svg
          fill="currentColor"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.325 8.309s-2.655-.334-8.357-.334c-5.517 0-8.294.334-8.294.334A2.675 2.675 0 0 0 5 10.984v10.034a2.675 2.675 0 0 0 2.674 2.676s2.582.332 8.294.332c5.709 0 8.357-.332 8.357-.332A2.673 2.673 0 0 0 27 21.018V10.982a2.673 2.673 0 0 0-2.675-2.673zM13.061 19.975V12.03L20.195 16l-7.134 3.975z"
          />
        </svg>
        YouTube
      </a>
    </div>
  </div>
</div>

<style>
  .form-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .form-actions button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #e0e0e0;
    border-top-color: #654074;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
