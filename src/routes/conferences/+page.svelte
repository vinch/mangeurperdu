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

<div class="page conferences mp-prose">
  <header class="page-header">
    <div class="header-copy">
      <h1>Conférences</h1>
      <p>
        Je donne des conférences pour expliquer les idées au cœur du livre
        <em>Mangeur Perdu</em> et partager une lecture claire de notre rapport moderne
        à l’alimentation.
      </p>

      {#if data.loadError}
        <p class="error">{data.loadError}</p>
      {/if}
    </div>

    <figure class="header-photo">
      <img
        src="/conference.jpg"
        alt="Conférence Mangeur Perdu"
        width="1200"
        height="800"
        loading="eager"
      />
    </figure>
  </header>

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
                <p class="place">
                  {#if item.address}
                    <a
                      class="place-link"
                      href={googleMapsUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ouvrir l’adresse dans Google Maps"
                      >{item.address}</a
                    >
                  {/if}
                  {#if countryEmoji(item.country)}
                    {item.address ? " " : ""}<span
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
                  class="cta"
                  href={item.rsvp_url}
                  target="_blank"
                  rel="noopener noreferrer">RSVP</a
                >
              {:else}
                <button
                  type="button"
                  class="rsvp-disabled"
                  disabled
                  aria-label="RSVP : aucun lien pour cette date pour le moment"
                >
                  RSVP
                </button>
              {/if}
              {#if item.ticket_url}
                <a
                  class="cta-secondary"
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
                <p class="place">
                  {#if item.address}
                    <a
                      class="place-link"
                      href={googleMapsUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ouvrir l’adresse dans Google Maps"
                      >{item.address}</a
                    >
                  {/if}
                  {#if countryEmoji(item.country)}
                    {item.address ? " " : ""}<span
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

  <section class="organizer-cta" aria-labelledby="organizer-cta-title">
    <h2 id="organizer-cta-title">Organisateurs</h2>
    <p class="organizer-hint">
      Pour toute demande de conférence, merci de me contacter en me partageant
      les informations clés de votre projet.
    </p>
    <EmailLink
      className="cta"
      subject={bookingSubject}
      body={bookingBody}
      ariaLabel="Proposer une intervention — email réservé aux organisateurs d’événements"
    >
      M’inviter à intervenir →
    </EmailLink>
  </section>
</div>

<style>
  .page-header {
    margin-bottom: 2.25rem;
  }

  .organizer-cta {
    width: 100%;
    max-width: min(32rem, 100%);
    margin: 2.5rem auto 0;
    padding: 1rem 1.15rem 1.15rem;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(101, 64, 116, 0.04);
    box-sizing: border-box;
  }

  .organizer-cta h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  .organizer-hint {
    margin: 0 0 0.75rem;
    color: #56616b;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  .organizer-cta :global(.cta) {
    margin-top: 0;
  }

  .header-photo {
    margin: 1.35rem 0 0;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  }

  .header-photo img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 2 / 1;
  }

  .error {
    margin-top: 1rem;
    color: #8b0000;
    font-weight: 600;
  }

  h2 {
    font-size: 2rem;
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
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
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.75);
  }

  .date {
    margin: 0 0 0.35rem;
    font-size: clamp(1.05rem, 2.5vw, 1.28rem);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #1f2d3a;
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
    color: inherit;
    font: inherit;
    text-decoration: underline;
    text-decoration-color: rgba(101, 64, 116, 0.35);
    text-underline-offset: 2px;
  }

  .place-link:hover {
    color: #654074;
    text-decoration-color: #654074;
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
    background: rgba(101, 64, 116, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.06);
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
  }

  .item-actions .rsvp-disabled {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    font: inherit;
    font-weight: var(--mp-btn-font-weight);
    font-size: var(--mp-btn-font-size);
    line-height: 1.2;
    padding: var(--mp-btn-pad-y) var(--mp-btn-pad-x);
    border-radius: var(--mp-btn-radius);
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
    color: #8b949e;
    cursor: not-allowed;
    opacity: 0.9;
  }

  .past {
    margin-top: 1rem;
    opacity: 0.95;
  }

  .past-item {
    background: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 800px) {
    .header-photo img {
      aspect-ratio: 16 / 10;
      max-height: none;
    }
  }
</style>
