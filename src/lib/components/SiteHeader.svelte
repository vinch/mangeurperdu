<script lang="ts">
  import { page } from "$app/state";

  let { variant = "dark" }: { variant?: "light" | "dark" } = $props();

  let scrolled = $state(false);
  let mobileOpen = $state(false);

  const navItems = [
    { href: "/", label: "Livre" },
    { href: "/conferences", label: "Conférences" },
    // { href: "/collab", label: "Collaborations" },
    { href: "/about", label: "À propos" },
  ] as const;

  function isNavActive(href: string, pathname: string): boolean {
    if (href === "/") return pathname === "/" || pathname === "";
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
      scrolled = window.scrollY > 10;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  });

  // Ferme le menu mobile lors de la navigation.
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

<header class="site-header" data-variant={variant} data-scrolled={scrolled}>
  <div class="inner">
    <a class="brand" href="/" aria-label="Mangeur Perdu — Accueil">
      <img src="/logo.jpg" alt="Mangeur Perdu" />
    </a>

    <nav class="nav nav-desktop" aria-label="Navigation principale">
      {#each navItems as { href, label } (href)}
        {@const active = isNavActive(href, page.url.pathname)}
        <a
          {href}
          class:is-active={active}
          aria-current={active ? "page" : undefined}>{label}</a
        >
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
        >{label}</a
      >
    {/each}
  </nav>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    --header-height: 64px;
    height: var(--header-height);
    transition: box-shadow 180ms ease;
  }

  .site-header[data-variant="dark"] {
    background: rgba(101, 64, 116, 1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .site-header[data-variant="light"] {
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .site-header[data-scrolled="true"] {
    box-shadow:
      0 14px 40px rgba(0, 0, 0, 0.22),
      0 2px 0 rgba(0, 0, 0, 0.06);
  }

  .inner {
    max-width: var(--mp-shell-max, 1100px);
    margin: 0 auto;
    height: 100%;
    padding: 0 var(--mp-shell-pad-x, 1.25rem);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    width: fit-content;
    height: var(--header-height);
  }

  .brand img {
    height: var(--header-height);
    width: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
  }

  .nav {
    display: flex;
    gap: 1.5rem;
    margin-left: auto;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .menu-btn {
    margin-left: auto;
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    border-radius: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .menu-btn:focus-visible {
    outline: 2px solid var(--mp-purple);
    outline-offset: 2px;
  }

  .menu-icon {
    display: grid;
    gap: 4px;
  }

  .menu-icon .bar {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: #fff;
    opacity: 0.95;
  }

  .menu-backdrop {
    position: fixed;
    inset: var(--header-height) 0 0 0;
    background: rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(2px);
    z-index: 60;
  }

  .nav-mobile {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    padding: 0.75rem var(--mp-shell-pad-x, 1.25rem) 1rem;
    margin: 0;
    display: grid;
    gap: 0.25rem;
    background: inherit;
    border-bottom: inherit;
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 160ms ease,
      opacity 160ms ease;
    z-index: 70;
  }

  .nav-mobile[data-open="true"] {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-mobile a {
    padding: 0.55rem 0;
    border-bottom: 1px solid transparent;
  }

  .site-header[data-variant="dark"] .nav-mobile a {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .site-header[data-variant="light"] .nav-mobile a {
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  .nav a {
    text-decoration: none;
    font-weight: 550;
    opacity: 0.88;
    padding: 0.2rem 0;
    border-bottom: 2px solid transparent;
    transition:
      opacity 0.15s ease,
      border-color 0.15s ease;
  }

  .nav a:hover {
    opacity: 1;
  }

  .site-header[data-variant="dark"] .nav a.is-active {
    opacity: 1;
    border-bottom-color: rgba(255, 255, 255, 0.92);
  }

  .site-header[data-variant="light"] .nav a.is-active {
    opacity: 1;
    color: var(--mp-purple, #654074);
    border-bottom-color: var(--mp-purple, #654074);
  }

  .site-header[data-variant="dark"] .brand,
  .site-header[data-variant="dark"] .nav a {
    color: white;
  }

  .site-header[data-variant="light"] .brand,
  .site-header[data-variant="light"] .nav a {
    color: #2c3e50;
  }

  @media (max-width: 820px) {
    .inner {
      justify-content: space-between;
      padding-left: 0;
      padding-right: 0;
    }
    .nav-desktop {
      display: none;
    }
    .menu-btn {
      display: inline-flex;
    }
  }
</style>
