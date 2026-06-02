<script lang="ts">
  import { page } from "$app/state";

  let scrolled = $state(false);
  let mobileOpen = $state(false);

  const navItems = [
    { href: "/livre", label: "Livre" },
    { href: "/conferences", label: "Conférences" },
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
      background-color 0.2s ease,
      border-color 0.2s ease,
      height 0.2s ease;
  }

  .site-header[data-scrolled="true"] {
    --header-height: 72px;
    background: #fff;
    border-bottom-color: rgba(17, 24, 39, 0.08);
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
    color: var(--mp-text, #1f2d3a);
    flex-shrink: 0;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .brand-name {
    font-size: 0.98rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    margin-left: auto;
  }

  .nav a {
    text-decoration: none;
    font-size: 0.98rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--mp-text, #1f2d3a);
    padding: 0.2rem 0;
    border-bottom: 2px solid transparent;
    transition: border-color 0.15s ease;
  }

  .nav a:hover {
    border-bottom-color: rgba(31, 45, 58, 0.2);
  }

  .nav a.is-active {
    border-bottom-color: var(--mp-purple, #654074);
  }

  .menu-btn {
    margin-left: auto;
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
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
    background: #1f2d3a;
  }

  .menu-backdrop {
    position: fixed;
    inset: var(--header-height) 0 0 0;
    background: rgba(17, 24, 39, 0.2);
    backdrop-filter: blur(2px);
    z-index: 60;
    border: none;
    cursor: pointer;
  }

  .nav-mobile {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    padding: 0.75rem var(--mp-shell-pad-x, 1.25rem) 1rem;
    margin: 0;
    display: grid;
    gap: 0.15rem;
    background: #fff;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    transform: translateY(-6px);
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
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(17, 24, 39, 0.06);
  }

  @media (max-width: 820px) {
    .brand-name {
      display: none;
    }

    .nav-desktop {
      display: none;
    }

    .menu-btn {
      display: inline-flex;
    }
  }
</style>
