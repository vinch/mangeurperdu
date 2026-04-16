<script lang="ts">
  import { onMount } from "svelte";

  export let local = "vincent.battaglia";
  export let domain = "gmail.com";
  export let subject: string | undefined = undefined;
  export let body: string | undefined = undefined;
  export let className = "";
  export let ariaLabel: string | undefined = undefined;

  let href = "";

  onMount(() => {
    const email = `${local}@${domain}`;
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    const qs = params.toString();
    href = `mailto:${email}${qs ? `?${qs}` : ""}`;
  });
</script>

<a class={className} {href} aria-label={ariaLabel}>
  <slot />
</a>

