<script lang="ts">
  import { BOOK_RELEASE_FULL } from "$lib/book";

  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { href: "/livre", label: "Livre" },
    { href: "/conferences", label: "Conférences" },
    { href: "/interviews", label: "Interviews" },
    { href: "/about", label: "À propos" },
  ] as const;

  const secondaryLinks = [
    { href: "/resources", label: "Ressources" },
    { href: "/sources", label: "Sources" },
    { href: "/collab", label: "Collab" },
  ] as const;
</script>

<footer class="site-footer">
  <div class="footer-inner site-container">
    <div class="footer-brand">
      <a class="footer-logo" href="/" aria-label="Mangeur Perdu — Accueil">
        <img src="/logo.jpg" alt="" width="44" height="44" loading="lazy" />
        <span>Mangeur Perdu</span>
      </a>
      <p class="footer-tagline">
        Comprendre pourquoi on ne sait plus comment manger — et retrouver le bon
        sens.
      </p>
      <div class="footer-links" aria-label="Réseaux sociaux">
        <a
          href="https://www.instagram.com/mangeurperdu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"
            />
            <path
              d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"
            />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@mangeurperdu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          title="YouTube"
        >
          <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M24.325 8.309s-2.655-.334-8.357-.334c-5.517 0-8.294.334-8.294.334A2.675 2.675 0 0 0 5 10.984v10.034a2.675 2.675 0 0 0 2.674 2.676s2.582.332 8.294.332c5.709 0 8.357-.332 8.357-.332A2.673 2.673 0 0 0 27 21.018V10.982a2.673 2.673 0 0 0-2.675-2.673zM13.061 19.975V12.03L20.195 16l-7.134 3.975z"
            />
          </svg>
        </a>
      </div>
    </div>

    <nav class="footer-col" aria-label="Pages principales">
      <p class="footer-col-title">Explorer</p>
      <ul>
        {#each mainLinks as { href, label } (href)}
          <li><a {href}>{label}</a></li>
        {/each}
      </ul>
    </nav>

    <nav class="footer-col" aria-label="Liens secondaires">
      <p class="footer-col-title">Aller plus loin</p>
      <ul>
        {#each secondaryLinks as { href, label } (href)}
          <li><a {href}>{label}</a></li>
        {/each}
      </ul>
    </nav>
  </div>

  <div class="site-container">
    <div class="footer-bottom">
      <p class="copyright">Copyright &copy; {currentYear} Mangeur Perdu</p>
      <p class="footer-note">{BOOK_RELEASE_FULL}.</p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--mp-sand, #f4efe7);
    border-top: 1px solid var(--mp-line, rgba(0, 0, 0, 0.08));
    padding: 3.5rem 0 0;
    color: var(--mp-text, #1b2632);
  }

  .footer-inner {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.7fr) minmax(0, 0.7fr);
    gap: 2.5rem;
    padding-bottom: 2.75rem;
  }

  .footer-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--mp-ink, #141c26);
    font-size: 1.1rem;
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  .footer-logo img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 3px rgba(210, 112, 15, 0.35);
  }

  .footer-tagline {
    margin: 1rem 0 1.5rem;
    max-width: 34ch;
    color: var(--mp-muted, #5a6470);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .footer-links {
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }

  .footer-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid var(--mp-border, rgba(0, 0, 0, 0.1));
    background: #fff;
    color: var(--mp-ink, #141c26);
    text-decoration: none;
    transition:
      background-color 0.2s var(--mp-ease, ease),
      color 0.2s var(--mp-ease, ease),
      border-color 0.2s var(--mp-ease, ease),
      transform 0.2s var(--mp-ease, ease);
  }

  .footer-links a:hover {
    background: var(--mp-ink, #141c26);
    border-color: var(--mp-ink, #141c26);
    color: #fff;
    transform: translateY(-2px);
  }

  .footer-col-title {
    margin: 0.35rem 0 1rem;
    font-size: 0.75rem;
    font-weight: 650;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mp-subtle, #8a9099);
  }

  .footer-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }

  .footer-col a {
    color: var(--mp-text, #1b2632);
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-col a:hover {
    color: var(--mp-orange-ink, #a8540a);
  }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.35rem;
    padding-bottom: 1.5rem;
    border-top: 1px solid var(--mp-line, rgba(0, 0, 0, 0.08));
  }

  .copyright,
  .footer-note {
    margin: 0;
    color: var(--mp-subtle, #8a9099);
    font-size: 0.85rem;
  }

  @media (max-width: 760px) {
    .site-footer {
      padding-top: 2.75rem;
    }

    .footer-inner {
      grid-template-columns: 1fr 1fr;
      gap: 2rem 1.5rem;
    }

    .footer-brand {
      grid-column: 1 / -1;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }
  }
</style>
