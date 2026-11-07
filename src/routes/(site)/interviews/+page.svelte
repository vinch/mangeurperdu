<script lang="ts">
  type Interview = {
    id: string;
    title: string;
    host: string;
    show?: string;
    dateLabel: string;
    /** ISO month for sorting (YYYY-MM). */
    date: string;
  };

  /** Plus récent en premier. */
  const interviews: Interview[] = [
    {
      id: "nZfJZ9gtvtU",
      title: "Vincent Battaglia : nutrition, santé & performance",
      host: "INSIDE MEDIA",
      show: "MEET & REC #1",
      dateLabel: "Septembre 2026",
      date: "2026-09",
    },
    {
      id: "hNRGecpqw-o",
      title:
        "Mangeur perdu : comment l’industrie alimentaire nous a embrouillés",
      host: "ALTHEA Life-Lab",
      show: "ALTHEA-TALK #9",
      dateLabel: "Janvier 2026",
      date: "2026-01",
    },
  ];

  function watchUrl(id: string) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  function embedUrl(id: string) {
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
</script>

<svelte:head>
  <title>Interviews — Mangeur Perdu</title>
  <meta
    name="description"
    content="Interviews et passages vidéo de Vincent Battaglia (Mangeur Perdu) sur YouTube."
  />
</svelte:head>

<div class="content-page interviews">
  <header class="content-head">
    <p class="mp-eyebrow">En vidéo</p>
    <h1>Interviews</h1>
    <p class="content-intro">
      Passages vidéo et échanges autour de
      <em>Mangeur Perdu</em>, de la nutrition et de notre rapport à
      l’alimentation moderne.
    </p>
  </header>

  <ul class="interview-list">
    {#each interviews as item (item.id)}
      <li class="interview">
        <div class="player">
          <iframe
            src={embedUrl(item.id)}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <div class="copy">
          <p class="when">{item.dateLabel}</p>
          <h2 class="title">{item.title}</h2>
          <p class="host">
            {item.host}{#if item.show}<span class="sep" aria-hidden="true"
                >·</span
              >{item.show}{/if}
          </p>
          <a
            class="cta-secondary btn-external"
            href={watchUrl(item.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir sur YouTube
          </a>
        </div>
      </li>
    {/each}
  </ul>

  <p class="channel">
    D’autres vidéos sur
    <a
      href="https://www.youtube.com/@mangeurperdu"
      target="_blank"
      rel="noopener noreferrer">youtube.com/@mangeurperdu</a
    >.
  </p>
</div>

<style>
  .interview-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1.5rem;
  }

  .interview {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 1.5rem 2.5rem;
    align-items: center;
    padding: 0.85rem 2.5rem 0.85rem 0.85rem;
    border-radius: var(--mp-radius-xl);
    border: 1px solid var(--mp-line);
    background: var(--mp-surface);
    box-shadow: var(--mp-shadow-sm);
  }

  .player {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 16px;
    overflow: hidden;
    background: var(--mp-night);
  }

  .player iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .when {
    margin: 0 0 0.25rem;
    font-size: 0.75rem;
    font-weight: 650;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mp-orange-ink);
  }

  .title {
    margin: 0;
    font-family: var(--mp-font-sans);
    font-size: clamp(1.3rem, 2.4vw, 1.65rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--mp-ink);
  }

  .host {
    margin: 0 0 1rem;
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--mp-muted);
  }

  .sep {
    margin: 0 0.45ch;
    opacity: 0.85;
  }

  .channel {
    margin: 2rem 0 0;
    color: var(--mp-muted);
    font-size: 0.98rem;
  }

  @media (max-width: 800px) {
    .interview {
      grid-template-columns: 1fr;
      gap: 1.1rem;
      padding: 0.65rem;
    }

    .copy {
      padding: 0 0.6rem 0.85rem;
    }
  }
</style>
