<script lang="ts">
  import type { RiskLevel } from "$lib/types/additives";
  import { RISK_LONG_LABELS, RISK_SHORT_LABELS } from "$lib/additives/labels";

  let {
    level,
    compact = false,
  }: {
    level: RiskLevel;
    /** Libellé court (listes), le libellé complet passe en infobulle. */
    compact?: boolean;
  } = $props();
</script>

<span
  class="risk-badge"
  data-level={level}
  title={compact ? RISK_LONG_LABELS[level] : undefined}
>
  <span class="dot" aria-hidden="true"></span>
  {compact ? RISK_SHORT_LABELS[level] : RISK_LONG_LABELS[level]}
</span>

<style>
  .risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    max-width: 100%;
    padding: 0.22rem 0.6rem 0.22rem 0.5rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.35;
    border: 1px solid transparent;
  }

  .dot {
    flex: none;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: currentColor;
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
