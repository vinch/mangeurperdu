<script lang="ts">
  import EmailLink from "$lib/components/EmailLink.svelte";

  type ConferenceItem = {
    id: string;
    starts_at: string;
    ends_at: string | null;
    venue: string;
    address: string | null;
    paf: string | null;
    country: string | null;
    status: string;
    ticket_url: string | null;
    rsvp_url: string | null;
  };

  type ConferencesPageData = {
    future: ConferenceItem[];
    past: ConferenceItem[];
    loadError: string | null;
  };

  let { data }: { data: ConferencesPageData } = $props();

  const bookingSubject =
    "Demande d’intervention (organisateur) — Mangeur Perdu";
  const bookingBody = `Bonjour,

Organisation / structure :
Ville / lieu :
Date(s) envisagée(s) :
Format souhaité (conférence, atelier, Q&A, autre) :

Merci !`;

  function fmt(dateStr: string) {
    const d = new Date(dateStr);
    const s = d.toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!s) return s;
    return s.charAt(0).toLocaleUpperCase("fr-FR") + s.slice(1);
  }

  /** Affichage pays : emoji pour FR / BE uniquement (reste = code tel quel). */
  function countryEmoji(code: string | null | undefined): string {
    const c = code?.trim().toUpperCase();
    if (!c) return "";
    if (c === "FR") return "🇫🇷";
    if (c === "BE") return "🇧🇪";
    return code!.trim();
  }

  function countryTitle(code: string | null | undefined): string | undefined {
    const c = code?.trim().toUpperCase();
    if (c === "FR") return "France";
    if (c === "BE") return "Belgique";
    return undefined;
  }

  /** Recherche Google Maps (adresse + pays en toutes lettres si dispo, pour le géocodage). */
  function googleMapsUrl(item: {
    address?: string | null;
    country?: string | null;
  }): string {
    const addr = item.address?.trim() ?? "";
    const hint = countryTitle(item.country) || item.country?.trim() || "";
    const query = hint ? `${addr}, ${hint}` : addr;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  /** Rue et localité (séparateur « · » en base, ex. « Rue X 7 · 7090 Ville »). */
  function parseAddress(address: string): { street: string; locality: string } {
    const raw = address.trim();
    const parts = raw
      .split(/\s*·\s*/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return { street: parts[0], locality: parts.slice(1).join(" · ") };
    }
    return { street: raw, locality: "" };
  }

  /** Affiche le PAF avec « EUR » après le montant (évite doublon si déjà € / EUR en base). */
  function formatPaf(paf: string | null | undefined): string {
    const raw = (paf ?? "").trim();
    if (!raw) return "";
    let v = raw.replace(/\u00a0/g, " ").trim();
    v = v
      .replace(/^(€|EUR|eur)\s*/iu, "")
      .replace(/\s*(€|EUR|eur)$/iu, "")
      .trim();
    const core = v || raw;
    if (/[a-zA-Zàâäéèêëïîôùûüç]/i.test(core)) return core;
    return `${core} EUR`;
  }
</script>

<svelte:head>
  <title>Conférences — Mangeur Perdu</title>
  <meta
    name="description"
    content="Dates de conférences à venir. Organisateurs : demande d’intervention par email."
  />
</svelte:head>

<div class="conf-page">
  <section class="conf-hero">
    <div class="conf-hero-copy">
      <h1>Conférences</h1>
      <p>
        Je donne des conférences pour expliquer les idées au cœur du livre
        <em>Mangeur Perdu</em> et partager une lecture claire de notre rapport moderne
        à l’alimentation.
      </p>
    </div>
    <figure class="conf-hero-photo">
      <img
        src="/conference.jpg"
        alt="Conférence Mangeur Perdu"
        width="1200"
        height="800"
        loading="eager"
      />
    </figure>
  </section>

  {#if data.loadError}
    <p class="error">{data.loadError}</p>
  {/if}

  <div class="conf-columns">
    <div class="conf-dates">
      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title">Dates à venir</h2>

        {#if data.future.length === 0}
          <p class="empty">Aucune date annoncée pour le moment.</p>
        {:else}
          <ul class="list">
            {#each data.future as item (item.id)}
              <li class="item">
                <div class="meta">
                  <p class="date">{fmt(item.starts_at)}</p>
                  <p class="venue-name">{item.venue}</p>
                  {#if item.address || item.country}
                    {@const addr = item.address
                      ? parseAddress(item.address)
                      : null}
                    <p class="place">
                      {#if addr}
                        <a
                          class="place-link"
                          href={googleMapsUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ouvrir l’adresse dans Google Maps"
                        >
                          <span class="place-line">{addr.street}</span>
                          {#if addr.locality}
                            <span class="place-line">
                              {addr.locality}
                              {#if countryEmoji(item.country)}
                                <span
                                  class="country-flag"
                                  title={countryTitle(item.country)}
                                  >{countryEmoji(item.country)}</span
                                >
                              {/if}
                            </span>
                          {:else if countryEmoji(item.country)}
                            <span class="place-line">
                              <span
                                class="country-flag"
                                title={countryTitle(item.country)}
                                >{countryEmoji(item.country)}</span
                              >
                            </span>
                          {/if}
                        </a>
                      {:else if countryEmoji(item.country)}
                        <span
                          class="country-flag"
                          title={countryTitle(item.country)}
                          >{countryEmoji(item.country)}</span
                        >
                      {/if}
                    </p>
                  {/if}
                  {#if item.paf}
                    <p class="paf" aria-label="Participation">
                      {formatPaf(item.paf)}
                    </p>
                  {/if}
                </div>
                <div class="item-actions">
                  {#if item.rsvp_url}
                    <a
                      class="cta btn-external"
                      href={item.rsvp_url}
                      target="_blank"
                      rel="noopener noreferrer">RSVP</a
                    >
                  {:else}
                    <span
                      class="rsvp-disabled"
                      aria-disabled="true"
                      title="Lien RSVP à venir pour cette date"
                    >
                      RSVP
                    </span>
                  {/if}
                  {#if item.ticket_url}
                    <a
                      class="cta-secondary btn-external"
                      href={item.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer">Infos / billets</a
                    >
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </section>

      {#if data.past.length > 0}
        <section aria-labelledby="past-title" class="past">
          <h2 id="past-title">Dates passées</h2>
          <ul class="list">
            {#each data.past as item (item.id)}
              <li class="item past-item">
                <div class="meta">
                  <p class="date">{fmt(item.starts_at)}</p>
                  <p class="venue-name">{item.venue}</p>
                  {#if item.address || item.country}
                    {@const addr = item.address
                      ? parseAddress(item.address)
                      : null}
                    <p class="place">
                      {#if addr}
                        <a
                          class="place-link"
                          href={googleMapsUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ouvrir l’adresse dans Google Maps"
                        >
                          <span class="place-line">{addr.street}</span>
                          {#if addr.locality}
                            <span class="place-line">
                              {addr.locality}
                              {#if countryEmoji(item.country)}
                                <span
                                  class="country-flag"
                                  title={countryTitle(item.country)}
                                  >{countryEmoji(item.country)}</span
                                >
                              {/if}
                            </span>
                          {:else if countryEmoji(item.country)}
                            <span class="place-line">
                              <span
                                class="country-flag"
                                title={countryTitle(item.country)}
                                >{countryEmoji(item.country)}</span
                              >
                            </span>
                          {/if}
                        </a>
                      {:else if countryEmoji(item.country)}
                        <span
                          class="country-flag"
                          title={countryTitle(item.country)}
                          >{countryEmoji(item.country)}</span
                        >
                      {/if}
                    </p>
                  {/if}
                  {#if item.paf}
                    <p class="paf" aria-label="Participation">
                      {formatPaf(item.paf)}
                    </p>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>

    <aside class="conf-organizer" aria-labelledby="organizer-cta-title">
      <h2 id="organizer-cta-title">Organisateurs</h2>
      <p class="organizer-hint">
        Vous organisez un événement et souhaitez m’inviter à intervenir&nbsp;?
        Écrivez-moi en partageant les informations clés de votre projet.
      </p>
      <EmailLink
        className="cta btn-mail"
        subject={bookingSubject}
        body={bookingBody}
        ariaLabel="Proposer une intervention — email réservé aux organisateurs d’événements"
      >
        M’inviter à intervenir
      </EmailLink>
    </aside>
  </div>
</div>

<style>
  .conf-page {
    width: 100%;
    max-width: var(--mp-shell-max);
    margin: 0 auto;
    padding: 0 var(--mp-shell-pad-x) 4rem;
    box-sizing: border-box;
  }

  /* —— Bloc hero : texte à gauche, photo entière à droite —— */
  .conf-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    align-items: center;
    border-radius: 1.35rem;
    overflow: hidden;
    background: #f0f3f6;
  }

  .conf-hero-photo {
    margin: 0;
    align-self: stretch;
  }

  .conf-hero-photo img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .conf-hero-copy {
    padding: 2.5rem 3rem;
    color: #1f2d3a;
  }

  .conf-hero-copy h1 {
    margin: 0 0 0.85rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.15rem, 3.8vw, 3.15rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #1f2d3a;
  }

  .conf-hero-copy p {
    margin: 0;
    font-size: 1.125rem;
    line-height: 1.55;
    color: var(--mp-muted, rgba(31, 45, 58, 0.72));
  }

  /* —— Deux colonnes : dates / organisateurs —— */
  .conf-columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: 2.5rem;
    margin-top: 2.5rem;
    align-items: start;
  }

  .conf-dates section + section {
    margin-top: 2rem;
  }

  .conf-organizer {
    position: sticky;
    top: calc(96px + 1.5rem);
    padding: 1.5rem;
    border-radius: 14px;
    border: none;
    background: rgba(101, 64, 116, 0.08);
    box-sizing: border-box;
  }

  .conf-organizer h2 {
    margin: 0 0 0.6rem;
    font-size: 1.4rem;
    color: #2c3e50;
  }

  .organizer-hint {
    margin: 0 0 1.1rem;
    color: #56616b;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .conf-organizer :global(.cta) {
    margin-top: 0;
  }

  .error {
    margin-top: 1rem;
    color: #8b0000;
    font-weight: 600;
  }

  h2 {
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 0.9rem;
    color: #2c3e50;
  }

  .empty {
    color: #56616b;
  }

  .list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }

  .item {
    border: none;
    border-radius: 16px;
    padding: 1.25rem 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem;
    background: #f4f6f8;
  }

  .meta {
    min-width: 0;
    flex: 1;
  }

  .date {
    margin: 0 0 0.35rem;
    font-size: clamp(1.05rem, 2.5vw, 1.28rem);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #1f2d3a;
    white-space: nowrap;
  }

  .venue-name {
    margin: 0 0 0.3rem;
    font-size: 0.95rem;
    font-weight: 650;
    line-height: 1.35;
    color: #56616b;
  }

  .place {
    color: #56616b;
    margin: 0;
  }

  .place-link {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
    color: inherit;
    font: inherit;
    text-decoration: none;
  }

  .place-line {
    display: block;
    line-height: 1.35;
  }

  .place-link:hover {
    color: #654074;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .paf {
    margin: 0.4rem 0 0;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 550;
    font-variant-numeric: tabular-nums;
    color: #6a737c;
    background: #fff;
    border: none;
  }

  .country-flag {
    white-space: nowrap;
  }

  .item-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
  }

  .item-actions .rsvp-disabled {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.35rem;
    font-size: 0.95rem;
    font-weight: var(--mp-btn-font-weight, 700);
    line-height: 1.2;
    border-radius: var(--mp-btn-radius, 999px);
    border: none;
    background: rgba(31, 45, 58, 0.08);
    color: rgba(31, 45, 58, 0.45);
    cursor: not-allowed;
  }

  .past {
    margin-top: 1rem;
    opacity: 0.95;
  }

  .past-item {
    background: #f7f8fa;
  }

  @media (max-width: 900px) {
    .conf-columns {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .conf-organizer {
      position: static;
      top: auto;
    }
  }

  @media (max-width: 720px) {
    .conf-hero {
      grid-template-columns: 1fr;
    }

    .conf-hero-photo {
      order: -1;
    }

    .conf-hero-photo img {
      height: auto;
      aspect-ratio: 3 / 2;
    }

    .conf-hero-copy {
      padding: 1.5rem 1.5rem 1.75rem;
    }

    .item {
      flex-direction: column;
      align-items: stretch;
    }

    .item-actions {
      justify-content: flex-start;
    }

    .date {
      font-size: clamp(0.95rem, 3.8vw, 1.15rem);
    }
  }
</style>
