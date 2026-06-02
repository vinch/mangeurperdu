<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Erreur — Encyclopédie des additifs</title>
</svelte:head>

<div class="ency-page">
  <div class="ency-inner">
    <h1>{page.status === 404 ? "Additif introuvable" : "Une erreur est survenue"}</h1>
    <p class="message">
      {page.error?.message ?? "Veuillez réessayer plus tard."}
    </p>
    <p class="back">
      <a href="/additives">← Retour à l’encyclopédie</a>
    </p>
  </div>
</div>

<style>
  .ency-page {
    flex: 1 1 auto;
    padding: 2rem var(--mp-shell-pad-x, 1.5rem);
  }

  .ency-inner {
    max-width: 56rem;
    margin: 0 auto;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-family: var(--mp-font-serif);
    font-size: 1.75rem;
    color: var(--mp-text, #1b2430);
  }

  .message {
    margin: 0 0 1rem;
    color: var(--mp-muted, rgba(27, 36, 48, 0.66));
  }

  .back a {
    color: var(--mp-purple, #654074);
    font-weight: 500;
    text-decoration: none;
  }

  .back a:hover {
    text-decoration: underline;
  }
</style>
