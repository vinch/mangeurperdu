<script lang="ts">
  import type { RiskLevel } from "$lib/types/additives";

  let {
    level,
  }: {
    level: RiskLevel;
  } = $props();

  const labels: Record<RiskLevel, string> = {
    blue: "Aucun signal préoccupant documenté à ce stade",
    yellow: "Signaux ou incertitudes à surveiller",
    red: "Signaux préoccupants ou restriction forte",
  };
</script>

<span class="risk-badge" data-level={level}>{labels[level]}</span>

<style>
  .risk-badge {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    padding: 0.22rem 0.55rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.35;
    border: 1px solid transparent;
  }

  .risk-badge[data-level="blue"] {
    color: #1e4a6b;
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.25);
  }

  .risk-badge[data-level="yellow"] {
    color: #7a5a12;
    background: rgba(234, 179, 8, 0.14);
    border-color: rgba(234, 179, 8, 0.32);
  }

  .risk-badge[data-level="red"] {
    color: #7f1d1d;
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.28);
  }
</style>
