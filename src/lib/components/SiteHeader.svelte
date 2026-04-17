<script lang="ts">
  import { page } from "$app/state";

  let { variant = "dark" }: { variant?: "light" | "dark" } = $props();

  let scrolled = $state(false);

  const navItems = [
    { href: "/", label: "Livre" },
    { href: "/conferences", label: "Conférences" },
    // { href: "/collab", label: "Collaborations" },
    { href: "/resources", label: "Ressources" },
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
</script>

<header class="site-header" data-variant={variant} data-scrolled={scrolled}>
  <div class="inner">
    <a class="brand" href="/" aria-label="Mangeur Perdu — Accueil">
      <img src="/logo.jpg" alt="Mangeur Perdu" />
    </a>

    <nav class="nav" aria-label="Navigation principale">
      {#each navItems as { href, label } (href)}
        {@const active = isNavActive(href, page.url.pathname)}
        <a
          {href}
          class:is-active={active}
          aria-current={active ? "page" : undefined}>{label}</a
        >
      {/each}
    </nav>
  </div>
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
      justify-content: center;
    }
    .nav {
      margin-left: 0;
      justify-content: center;
    }
  }
</style>
