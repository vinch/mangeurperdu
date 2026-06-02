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
  <button type="submit" class="btn-dark-lg" disabled={submitting}>
    {submitting ? "Envoi…" : buttonLabel}
  </button>
</form>

<style>
  .notify-form {
    display: flex;
    align-items: stretch;
    max-width: 28rem;
    padding: 0.3rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(17, 24, 39, 0.08);
  }

  .notify-form[data-variant="dark"] {
    background: #fff;
    max-width: 32rem;
  }

  .notify-form input[type="email"] {
    flex: 1;
    min-width: 0;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 999px;
    font: inherit;
    font-size: 0.95rem;
    background: transparent;
    color: #1f2d3a;
  }

  .notify-form input:focus {
    outline: none;
  }

  .notify-form input::placeholder {
    color: rgba(31, 45, 58, 0.45);
  }

  .notify-form :global(button.btn-dark-lg) {
    flex-shrink: 0;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    .notify-form {
      flex-direction: column;
      border-radius: 1rem;
      padding: 0.5rem;
      gap: 0.35rem;
    }

    .notify-form button {
      width: 100%;
    }
  }
</style>
