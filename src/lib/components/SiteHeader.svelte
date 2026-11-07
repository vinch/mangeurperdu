<script lang="ts">
  import { page } from "$app/state";

  let scrolled = $state(false);
  let mobileOpen = $state(false);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/livre", label: "Livre" },
    { href: "/conferences", label: "Conférences" },
    { href: "/interviews", label: "Interviews" },
    { href: "/about", label: "À propos" },
  ] as const;

  function isNavActive(href: string, pathname: string): boolean {
    if (href === "/") return pathname === "/" || pathname === "";
    if (href === "/livre") {
      return pathname === "/livre" || pathname.startsWith("/livre/");
    }
    if (href === "/resources") {
      return (
        pathname === "/resources" ||
        pathname.startsWith("/fat") ||
        pathname.startsWith("/additives")
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  $effect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      scrolled = window.scrollY > 8;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  });

  $effect(() => {
    page.url.pathname;
    mobileOpen = false;
  });

  $effect(() => {
    if (typeof window === "undefined") return;
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") mobileOpen = false;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
</script>

<header class="site-header" data-scrolled={scrolled}>
  <div class="inner site-container">
    <a class="brand" href="/" aria-label="Mangeur Perdu — Accueil">
      <img
        class="brand-logo"
        src="/logo.jpg"
        alt=""
        width="40"
        height="40"
      />
      <span class="brand-name">Mangeur Perdu</span>
    </a>

    <nav class="nav nav-desktop" aria-label="Navigation principale">
      {#each navItems as { href, label } (href)}
        {@const active = isNavActive(href, page.url.pathname)}
        <a
          {href}
          class:is-active={active}
          aria-current={active ? "page" : undefined}
        >
          {label}
        </a>
      {/each}
    </nav>

    <button
      type="button"
      class="menu-btn"
      aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={mobileOpen}
      aria-controls="mobile-nav"
      onclick={() => (mobileOpen = !mobileOpen)}
    >
      <span class="menu-icon" aria-hidden="true">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </span>
    </button>
  </div>

  {#if mobileOpen}
    <button
      type="button"
      class="menu-backdrop"
      aria-label="Fermer le menu"
      onclick={() => (mobileOpen = false)}
    ></button>
  {/if}

  <nav
    id="mobile-nav"
    class="nav nav-mobile"
    aria-label="Navigation principale (mobile)"
    data-open={mobileOpen}
  >
    {#each navItems as { href, label } (href)}
      {@const active = isNavActive(href, page.url.pathname)}
      <a
        {href}
        class:is-active={active}
        aria-current={active ? "page" : undefined}
        onclick={() => (mobileOpen = false)}
      >
        {label}
      </a>
    {/each}
  </nav>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    --header-height: 96px;
    height: var(--header-height);
    background: transparent;
    border-bottom: 1px solid transparent;
    transition:
      background-color 0.25s var(--mp-ease, ease),
      border-color 0.25s var(--mp-ease, ease),
      height 0.25s var(--mp-ease, ease);
  }

  .site-header[data-scrolled="true"] {
    --header-height: 72px;
    background: rgba(251, 250, 247, 0.82);
    -webkit-backdrop-filter: saturate(1.6) blur(16px);
    backdrop-filter: saturate(1.6) blur(16px);
    border-bottom-color: var(--mp-line, rgba(17, 24, 39, 0.08));
  }

  .inner {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--mp-ink, #141c26);
    flex-shrink: 0;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 3px rgba(210, 112, 15, 0.35);
    transition: transform 0.3s var(--mp-ease, ease);
  }

  .brand:hover .brand-logo {
    transform: rotate(-6deg) scale(1.04);
  }

  .brand-name {
    font-size: 1.02rem;
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
  }

  .nav-desktop a {
    position: relative;
    text-decoration: none;
    font-size: 0.94rem;
    font-weight: 550;
    letter-spacing: -0.01em;
    color: var(--mp-muted, #5a6470);
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    transition:
      color 0.2s var(--mp-ease, ease),
      background-color 0.2s var(--mp-ease, ease);
  }

  .nav-desktop a:hover {
    color: var(--mp-ink, #141c26);
    background: rgba(27, 38, 50, 0.05);
  }

  .nav-desktop a.is-active {
    color: var(--mp-ink, #141c26);
    font-weight: 650;
  }

  .nav-desktop a.is-active::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0.1rem;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: var(--mp-orange, #d2700f);
  }

  .menu-btn {
    margin-left: auto;
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--mp-line, rgba(17, 24, 39, 0.1));
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: var(--mp-shadow-sm);
  }

  .menu-btn:focus-visible {
    outline: 2px solid var(--mp-purple, #654074);
    outline-offset: 2px;
  }

  .menu-icon {
    display: grid;
    gap: 4px;
  }

  .menu-icon .bar {
    width: 16px;
    height: 2px;
    border-radius: 999px;
    background: var(--mp-ink, #141c26);
    transition:
      transform 0.25s var(--mp-ease, ease),
      opacity 0.2s ease;
  }

  .menu-btn[aria-expanded="true"] .bar:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }

  .menu-btn[aria-expanded="true"] .bar:nth-child(2) {
    opacity: 0;
  }

  .menu-btn[aria-expanded="true"] .bar:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }

  .menu-backdrop {
    position: fixed;
    inset: var(--header-height) 0 0 0;
    background: rgba(20, 28, 38, 0.28);
    backdrop-filter: blur(3px);
    z-index: 60;
    border: none;
    cursor: pointer;
  }

  .nav-mobile {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    padding: 0.5rem var(--mp-shell-pad-x, 1.25rem) 1.25rem;
    margin: 0;
    display: grid;
    gap: 0;
    background: var(--mp-bg, #fff);
    border-bottom: 1px solid var(--mp-line, rgba(17, 24, 39, 0.08));
    box-shadow: 0 24px 40px -24px rgba(20, 28, 38, 0.3);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 200ms var(--mp-ease, ease),
      opacity 200ms ease;
    z-index: 70;
  }

  .nav-mobile[data-open="true"] {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-mobile a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.95rem 0;
    font-size: 1.15rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: var(--mp-ink, #141c26);
    text-decoration: none;
    border-bottom: 1px solid var(--mp-line, rgba(17, 24, 39, 0.06));
  }

  .nav-mobile a:last-child {
    border-bottom: none;
  }

  .nav-mobile a::after {
    content: "→";
    color: var(--mp-subtle, #8a9099);
    font-weight: 500;
  }

  .nav-mobile a.is-active {
    color: var(--mp-orange-ink, #a8540a);
  }

  .nav-mobile a.is-active::after {
    color: var(--mp-orange, #d2700f);
  }

  @media (max-width: 820px) {
    .site-header,
    .site-header[data-scrolled="true"] {
      --header-height: 72px;
      background: rgba(251, 250, 247, 0.9);
      -webkit-backdrop-filter: saturate(1.6) blur(16px);
      backdrop-filter: saturate(1.6) blur(16px);
      transition: border-color 0.2s ease;
    }

    .site-header {
      border-bottom-color: transparent;
    }

    .site-header[data-scrolled="true"] {
      border-bottom-color: var(--mp-line, rgba(17, 24, 39, 0.08));
    }

    .nav-desktop {
      display: none;
    }

    .menu-btn {
      display: inline-flex;
    }
  }

  @media (max-width: 380px) {
    .brand-name {
      display: none;
    }
  }
</style>
