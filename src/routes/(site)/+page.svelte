<script>
  import HeroCarousel from "$lib/components/HeroCarousel.svelte";
  import InstagramFeed from "$lib/components/InstagramFeed.svelte";
  import { BOOK_RELEASE_TAGLINE } from "$lib/book";

  let { data } = $props();

  const heroSlides = [
    {
      id: "book",
      title: "Mangeur Perdu",
      subtitle: "Pourquoi on ne sait plus comment manger",
      body: BOOK_RELEASE_TAGLINE,
      ctaLabel: "Découvrir le livre",
      ctaHref: "/livre",
      theme: "warm",
      tone: "dark",
      imageSrc: "/cover-3d.png",
      imageAlt: "Couverture du livre Mangeur Perdu",
    },
    {
      id: "rebel-food",
      title: "Rebel Food",
      subtitle: "Changer durablement, pas en trois jours.",
      body: "Une app de changement d’habitudes simple, progressive, conçue pour tenir dans la vraie vie.",
      ctaLabel: "Découvrir Rebel Food",
      ctaHref: "https://www.rebelfood.eu",
      ctaExternal: true,
      theme: "purple",
      tone: "light",
      imageSrc: "/phones.png",
      imageAlt: "Aperçu de l’application Rebel Food",
    },
    {
      id: "conferences",
      title: "Conférences",
      subtitle: "C'est toujours mieux de se voir en vrai.",
      body: "Retrouvez les prochaines dates de mes interventions autour de l’alimentation.",
      ctaLabel: "Voir le calendrier",
      ctaHref: "/conferences",
      theme: "neutral",
      tone: "dark",
      imageSrc: "/conference.jpg",
      imageAlt: "Conférence Mangeur Perdu",
    },
  ];
</script>

<svelte:head>
  <title>Mangeur Perdu</title>
  <meta
    name="description"
    content="Livre, conférences, Rebel Food et ressources pour mieux comprendre comment on mange aujourd’hui."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mangeurperdu.com/" />
  <meta property="og:title" content="Mangeur Perdu" />
  <meta
    property="og:description"
    content="Livre, conférences, Rebel Food et ressources pour mieux comprendre comment on mange aujourd’hui."
  />
  <meta property="og:image" content="https://mangeurperdu.com/social.jpg" />
  <meta property="og:site_name" content="Mangeur Perdu" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://mangeurperdu.com/" />
  <meta property="twitter:title" content="Mangeur Perdu" />
  <meta
    property="twitter:description"
    content="Livre, conférences, Rebel Food et ressources pour mieux comprendre comment on mange aujourd’hui."
  />
  <meta
    property="twitter:image"
    content="https://mangeurperdu.com/social.jpg"
  />
</svelte:head>

<div class="home">
  <HeroCarousel slides={heroSlides} />

  <InstagramFeed
    posts={data.instagramPosts}
    loadError={data.instagramLoadError}
  />
</div>

<style>
  .home {
    background: #fff;
  }
</style>
