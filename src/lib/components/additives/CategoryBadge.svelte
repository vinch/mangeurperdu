<script lang="ts">
  let { category }: { category: string } = $props();
</script>

<span class="category-badge">{category}</span>

<style>
  .category-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--mp-text, #1b2430);
    background: rgba(101, 64, 116, 0.08);
    border: 1px solid rgba(101, 64, 116, 0.16);
  }
</style>
