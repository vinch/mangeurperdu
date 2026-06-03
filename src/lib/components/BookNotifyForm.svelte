<script lang="ts">
  let {
    variant = "light",
    buttonLabel = "Me notifier",
  }: {
    variant?: "light" | "dark";
    buttonLabel?: string;
  } = $props();

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

<form
  class="notify-form"
  data-variant={variant}
  onsubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
>
  <input
    type="email"
    bind:value={email}
    placeholder="Votre adresse email"
    required
    disabled={submitting}
    aria-label="Adresse email"
  />
  <button type="submit" class="notify-submit" disabled={submitting}>
    {submitting ? "Envoi…" : buttonLabel}
  </button>
</form>

<style>
  .notify-form {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 0.55rem;
    width: 100%;
    max-width: 32rem;
  }

  .notify-form input[type="email"] {
    flex: 1 1 12rem;
    min-width: 0;
    margin: 0;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(17, 24, 39, 0.12);
    border-radius: var(--mp-btn-radius, 999px);
    font: inherit;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.95);
    color: #1f2d3a;
  }

  .notify-form input:focus {
    outline: 2px solid rgba(101, 64, 116, 0.35);
    outline-offset: 1px;
  }

  .notify-form input::placeholder {
    color: rgba(31, 45, 58, 0.45);
  }

  .notify-form :global(.notify-submit) {
    flex: 0 1 auto;
    white-space: nowrap;
    padding: 0.75rem 1.35rem;
    font: inherit;
    font-size: 0.95rem;
    font-weight: var(--mp-btn-font-weight, 600);
    line-height: 1.2;
    border-radius: var(--mp-btn-radius, 999px);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }

  .notify-form :global(.notify-submit:disabled) {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Champ + bouton dans une seule pilule (écrans larges) */
  @media (min-width: 640px) {
    .notify-form[data-variant="light"],
    .notify-form[data-variant="dark"] {
      flex-wrap: nowrap;
      gap: 0;
      padding: 0.3rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(17, 24, 39, 0.08);
    }

    .notify-form[data-variant="dark"] {
      background: #fff;
    }

    .notify-form input[type="email"] {
      flex: 1 1 auto;
      border: none;
      background: transparent;
      outline: none;
    }

    .notify-form input:focus {
      outline: none;
    }
  }

  /* Bouton sombre dans la pilule */
  @media (min-width: 640px) {
    .notify-form :global(.notify-submit) {
      background: var(--mp-btn-dark-bg, #1f2d3a);
      color: #fff;
      border-color: var(--mp-btn-dark-bg, #1f2d3a);
    }

    .notify-form :global(.notify-submit:hover:not(:disabled)) {
      background: var(--mp-btn-dark-bg-hover, #354a5f);
      border-color: var(--mp-btn-dark-bg-hover, #354a5f);
    }
  }

  /* Mobile : champs séparés, bouton pleine largeur */
  @media (max-width: 639px) {
    .notify-form {
      flex-direction: column;
      align-items: stretch;
      gap: 0.65rem;
    }

    .notify-form input[type="email"] {
      flex: none;
      width: 100%;
    }

    .notify-form :global(.notify-submit) {
      width: 100%;
    }

    .notify-form[data-variant="dark"] :global(.notify-submit) {
      background: #fff;
      color: var(--mp-btn-dark-bg, #1f2d3a);
      border-color: rgba(255, 255, 255, 0.35);
    }

    .notify-form[data-variant="dark"] :global(.notify-submit:hover:not(:disabled)) {
      background: var(--mp-btn-light-bg-hover, #f3f4f6);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .notify-form[data-variant="light"] :global(.notify-submit) {
      background: var(--mp-btn-dark-bg, #1f2d3a);
      color: #fff;
      border-color: var(--mp-btn-dark-bg, #1f2d3a);
    }

    .notify-form[data-variant="light"]
      :global(.notify-submit:hover:not(:disabled)) {
      background: var(--mp-btn-dark-bg-hover, #354a5f);
      border-color: var(--mp-btn-dark-bg-hover, #354a5f);
    }
  }
</style>
