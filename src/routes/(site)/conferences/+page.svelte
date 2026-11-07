<script lang="ts">
  import { onMount } from "svelte";
  import CrossfadeImages from "$lib/components/CrossfadeImages.svelte";
  import EmailLink from "$lib/components/EmailLink.svelte";
  import { BOOK_RELEASE_ABOUT } from "$lib/book";
  import type {
    ConferenceItem,
    ConferencesPayload,
  } from "$lib/types/conference";

  const conferencePhotos = ["/conference.jpg", "/conference2.jpg"];

  /** Allonge le skeleton pour le tester en local (ex. 5000). Remettre à 0 en prod. */
  const SKELETON_EXTRA_MS = 0;

  let future = $state<ConferenceItem[]>([]);
  let past = $state<ConferenceItem[]>([]);
  let loadError = $state<string | null>(null);
  let loading = $state(true);

  const bookingSubject =
    "Demande d’intervention (organisateur) — Mangeur Perdu";
  const bookingBody = `Bonjour,

Organisation / structure :
Ville / lieu :
Date(s) envisagée(s) :
Format souhaité (conférence, atelier, Q&A, autre) :

Merci !`;

  onMount(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/conferences");
        const payload = (await res.json()) as ConferencesPayload;
        if (cancelled) return;

        if (!res.ok || payload.error) {
          loadError =
            payload.error ??
            "Impossible de charger les conférences pour le moment.";
          future = [];
          past = [];
          return;
        }

        future = payload.future ?? [];
        past = payload.past ?? [];
        loadError = null;
      } catch {
        if (!cancelled) {
          loadError = "Impossible de charger les conférences pour le moment.";
          future = [];
          past = [];
        }
      } finally {
        if (SKELETON_EXTRA_MS > 0) {
          await new Promise((r) => setTimeout(r, SKELETON_EXTRA_MS));
        }
        if (!cancelled) loading = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  });

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

  /** Jour / mois abrégé / année pour le badge calendrier (fuseau Paris). */
  function badgeParts(dateStr: string) {
    const d = new Date(dateStr);
    const part = (opts: Intl.DateTimeFormatOptions) =>
      d.toLocaleString("fr-FR", { timeZone: "Europe/Paris", ...opts });
    return {
      day: part({ day: "numeric" }),
      month: part({ month: "short" }).replace(".", ""),
      year: part({ year: "numeric" }),
    };
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
      <p class="mp-eyebrow">Sur scène</p>
      <h1>Conférences</h1>
      <p>
        Je donne des conférences pour expliquer les idées au cœur du livre
        <em>Mangeur Perdu</em> (à paraître {BOOK_RELEASE_ABOUT}) et partager une
        lecture claire de notre rapport moderne à l’alimentation.
      </p>
    </div>
    <figure class="conf-hero-photo">
      <CrossfadeImages
        sources={conferencePhotos}
        alt="Conférence Mangeur Perdu"
        width={1200}
        height={800}
        loading="eager"
      />
    </figure>
  </section>

  {#if loadError}
    <p class="error">{loadError}</p>
  {/if}

  <div class="conf-columns">
    <div class="conf-dates">
      <section aria-labelledby="upcoming-title" aria-busy={loading}>
        <h2 id="upcoming-title">
          Dates à venir
          {#if !loading && future.length > 0}
            <span class="count">{future.length}</span>
          {/if}
        </h2>

        {#if loading}
          <ul class="list" aria-hidden="true">
            {#each [1, 2, 3] as i (i)}
              <li class="item skeleton-item">
                <div class="skel skel-badge"></div>
                <div class="meta">
                  <div class="skel skel-date"></div>
                  <div class="skel skel-venue"></div>
                  <div class="skel skel-place"></div>
                </div>
                <div class="item-actions">
                  <div class="skel skel-btn"></div>
                </div>
              </li>
            {/each}
          </ul>
          <p class="visually-hidden" role="status">
            Chargement des conférences…
          </p>
        {:else if future.length === 0}
          <p class="empty">Aucune date annoncée pour le moment.</p>
        {:else}
          <ul class="list">
            {#each future as item (item.id)}
              {@const b = badgeParts(item.starts_at)}
              <li class="item">
                <div class="date-badge" aria-hidden="true">
                  <span class="badge-month">{b.month}</span>
                  <span class="badge-day">{b.day}</span>
                  <span class="badge-year">{b.year}</span>
                </div>
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

      {#if !loading && past.length > 0}
        <section aria-labelledby="past-title" class="past">
          <h2 id="past-title">Dates passées</h2>
          <ul class="list">
            {#each past as item (item.id)}
              {@const b = badgeParts(item.starts_at)}
              <li class="item past-item">
                <div class="date-badge" aria-hidden="true">
                  <span class="badge-month">{b.month}</span>
                  <span class="badge-day">{b.day}</span>
                  <span class="badge-year">{b.year}</span>
                </div>
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
      <p class="mp-eyebrow" data-tone="light">Organisateurs</p>
      <h2 id="organizer-cta-title">Inviter Mangeur Perdu</h2>
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
    padding: 0 var(--mp-shell-pad-x) 5.5rem;
    box-sizing: border-box;
  }

  /* —— Bloc hero : texte à gauche, photo entière à droite —— */
  .conf-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    align-items: center;
    min-height: 28rem;
    border-radius: var(--mp-radius-xl);
    overflow: hidden;
    background: var(--mp-sand);
    box-shadow: inset 0 0 0 1px rgba(20, 28, 38, 0.05);
  }

  .conf-hero-photo {
    margin: 0;
    align-self: stretch;
  }

  .conf-hero-photo :global(.crossfade) {
    width: 100%;
    height: 100%;
  }

  .conf-hero-copy {
    padding: 3rem 3.5rem 3rem 4rem;
    color: var(--mp-ink);
  }

  .conf-hero-copy h1 {
    margin: 0 0 1.1rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.5rem, 4.6vw, 3.9rem);
    font-weight: 750;
    line-height: 1;
    letter-spacing: -0.045em;
    color: var(--mp-ink);
  }

  .conf-hero-copy p:not(.mp-eyebrow) {
    margin: 0;
    max-width: 40ch;
    font-size: 1.1rem;
    line-height: 1.65;
    color: var(--mp-muted);
  }

  /* —— Deux colonnes : dates / organisateurs —— */
  .conf-columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: 3rem;
    margin-top: 4rem;
    align-items: start;
  }

  .conf-dates section + section {
    margin-top: 3rem;
  }

  .conf-organizer {
    position: sticky;
    top: calc(72px + 1.5rem);
    padding: 1.75rem;
    border-radius: var(--mp-radius-xl);
    border: none;
    background:
      radial-gradient(
        ellipse 80% 60% at 100% 0%,
        rgba(210, 112, 15, 0.22) 0%,
        rgba(210, 112, 15, 0) 70%
      ),
      var(--mp-night);
    color: #fff;
    box-shadow: var(--mp-shadow-lg);
    box-sizing: border-box;
  }

  .conf-organizer :global(.mp-eyebrow) {
    margin-bottom: 0.85rem;
  }

  .conf-organizer h2 {
    margin: 0 0 0.75rem;
    font-size: 1.4rem;
    line-height: 1.2;
    color: #fff;
  }

  .organizer-hint {
    margin: 0 0 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .conf-organizer :global(.cta) {
    margin-top: 0;
    width: 100%;
    background: #fff;
    color: var(--mp-ink);
    border-color: #fff;
  }

  .conf-organizer :global(.cta:hover) {
    background: var(--mp-orange-soft);
    border-color: var(--mp-orange-soft);
  }

  .error {
    margin-top: 1rem;
    color: #8b0000;
    font-weight: 600;
  }

  .conf-dates h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: clamp(1.6rem, 2.6vw, 2rem);
    font-weight: 750;
    letter-spacing: -0.035em;
    margin-top: 0;
    margin-bottom: 1.25rem;
    color: var(--mp-ink);
  }

  .count {
    display: inline-grid;
    place-items: center;
    min-width: 1.75rem;
    height: 1.75rem;
    padding: 0 0.5rem;
    border-radius: 999px;
    background: var(--mp-orange-soft);
    color: var(--mp-orange-ink);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0;
  }

  .empty {
    padding: 1.5rem;
    border-radius: var(--mp-radius-lg);
    border: 1px dashed var(--mp-border);
    color: var(--mp-muted);
  }

  .list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.85rem;
  }

  .item {
    border: 1px solid var(--mp-line);
    border-radius: var(--mp-radius-lg);
    padding: 1.35rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    background: var(--mp-surface);
    box-shadow: var(--mp-shadow-sm);
    transition:
      box-shadow 0.2s var(--mp-ease),
      border-color 0.2s var(--mp-ease);
  }

  .item:not(.past-item):not(.skeleton-item):hover {
    border-color: rgba(210, 112, 15, 0.3);
    box-shadow: var(--mp-shadow-md);
  }

  .date-badge {
    flex-shrink: 0;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 4.5rem;
    padding: 0.6rem 0 0.65rem;
    border-radius: 14px;
    background: var(--mp-orange-soft);
    color: var(--mp-orange-ink);
    line-height: 1;
    text-align: center;
  }

  .badge-month {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .badge-day {
    margin: 0.2rem 0 0.25rem;
    font-size: 1.75rem;
    font-weight: 750;
    letter-spacing: -0.04em;
    color: var(--mp-ink);
  }

  .badge-year {
    font-size: 0.72rem;
    font-weight: 600;
    opacity: 0.8;
  }

  .meta {
    min-width: 0;
    flex: 1;
  }

  .date {
    margin: 0 0 0.3rem;
    font-size: clamp(1.02rem, 2.2vw, 1.15rem);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: var(--mp-ink);
  }

  .venue-name {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--mp-text);
  }

  .place {
    color: var(--mp-muted);
    font-size: 0.92rem;
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
    color: var(--mp-purple);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .paf {
    margin: 0.65rem 0 0;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    padding: 0.22rem 0.65rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--mp-text);
    background: var(--mp-sand);
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

  .past-item {
    background: transparent;
    box-shadow: none;
  }

  .past-item .date-badge {
    background: rgba(27, 38, 50, 0.05);
    color: var(--mp-subtle);
  }

  .past-item .badge-day {
    color: var(--mp-muted);
  }

  .past-item .date {
    color: var(--mp-text);
  }

  .skeleton-item {
    pointer-events: none;
  }

  .skel {
    border-radius: 6px;
    background: linear-gradient(
      90deg,
      rgba(31, 45, 58, 0.06) 0%,
      rgba(31, 45, 58, 0.12) 50%,
      rgba(31, 45, 58, 0.06) 100%
    );
    background-size: 200% 100%;
    animation: skel-shimmer 1.2s ease-in-out infinite;
  }

  .skel-date {
    width: min(18rem, 70%);
    height: 1.15rem;
    margin-bottom: 0.55rem;
  }

  .skel-venue {
    width: min(12rem, 45%);
    height: 0.85rem;
    margin-bottom: 0.45rem;
  }

  .skel-place {
    width: min(14rem, 55%);
    height: 0.75rem;
  }

  .skel-badge {
    flex-shrink: 0;
    width: 4.5rem;
    height: 4.6rem;
    border-radius: 14px;
  }

  .skel-btn {
    width: 5.5rem;
    height: 2.5rem;
    border-radius: 999px;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes skel-shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
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

    .conf-hero-photo :global(.crossfade) {
      height: auto;
      aspect-ratio: 3 / 2;
    }

    .conf-hero {
      min-height: 0;
    }

    .conf-hero-copy {
      padding: 1.75rem 1.5rem 2rem;
    }

    .conf-columns {
      margin-top: 2.75rem;
    }

    .item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: 1rem;
      padding: 1.15rem;
    }

    .date-badge {
      width: 3.75rem;
    }

    .badge-day {
      font-size: 1.45rem;
    }

    .item-actions {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }

    .date {
      font-size: clamp(0.95rem, 3.8vw, 1.15rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skel {
      animation: none;
    }
  }
</style>
