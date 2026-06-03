<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";

  let {
    local = "vincent.battaglia",
    domain = "gmail.com",
    subject,
    body,
    className = "",
    ariaLabel,
    children,
  }: {
    local?: string;
    domain?: string;
    subject?: string;
    body?: string;
    className?: string;
    ariaLabel?: string;
    children: Snippet;
  } = $props();

  let href = $state("");

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
  {@render children()}
</a>

