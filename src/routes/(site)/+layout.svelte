<script lang="ts">
  import type { Snippet } from "svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="site-shell">
  <SiteHeader />
  <main class="site-main">
    {@render children()}
  </main>
  <SiteFooter />
</div>
