<script lang="ts">
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
</script>

<div class="site-shell">
  <SiteHeader />
  <main class="site-main">
    <slot />
  </main>
  <SiteFooter />
</div>
