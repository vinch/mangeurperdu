<script>
  /** @type {import('./$types').ErrorComponent} */
  let { status, message } = $props();
</script>

<svelte:head>
  <title>{status === 404 ? "Page introuvable" : "Erreur"} — Mangeur Perdu</title
  >
</svelte:head>

<div class="error-page">
  <div class="error-card">
    <p class="error-code">{status}</p>
    <h1>
      {#if status === 404}
        Page introuvable
      {:else}
        Oups, une erreur est survenue
      {/if}
    </h1>
    <p class="error-message">
      {#if status === 404}
        La page que vous cherchez n'existe pas ou a été déplacée.
      {:else}
        {message || "Veuillez réessayer plus tard."}
      {/if}
    </p>
    <a href="/" class="back-link">← Retour à l'accueil</a>
  </div>
</div>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .error-card {
    background: white;
    border-radius: 12px;
    padding: 3rem;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  }

  .error-code {
    font-size: 4rem;
    font-weight: 700;
    color: #654074;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
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
</style>
