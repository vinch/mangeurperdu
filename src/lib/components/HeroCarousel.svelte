<script lang="ts">
  export type HeroSlide = {
    id: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
    ctaExternal?: boolean;
    imageSrc?: string;
    imageAlt?: string;
    theme: "warm" | "purple" | "neutral";
    /** Texte clair sur fond foncé, ou texte foncé sur fond clair (défaut selon theme). */
    tone?: "light" | "dark";
  };

  import type { Snippet } from "svelte";
  import { tick } from "svelte";

  function slideTone(slide: HeroSlide): "light" | "dark" {
    if (slide.tone) return slide.tone;
    return slide.theme === "purple" ? "light" : "dark";
  }

  function slideBtnClass(tone: "light" | "dark") {
    return tone === "light" ? "btn-light-lg" : "btn-dark-lg";
  }

  function slideUsesPhotoHero(slide: HeroSlide) {
    return slide.theme === "neutral" && Boolean(slide.imageSrc);
  }

  let {
    slides,
    autoplayMs = 8000,
    notifySlideId,
    notify,
  }: {
    slides: HeroSlide[];
    autoplayMs?: number;
    notifySlideId?: string;
    notify?: Snippet;
  } = $props();

  const initialTrackIndex = slides.length <= 1 ? 0 : slides.length;

  let trackIndex = $state(initialTrackIndex);
  let transitionEnabled = $state(false);
  let trackLayoutReady = $state(false);
  let paused = $state(false);
  let viewportEl = $state<HTMLDivElement | undefined>(undefined);
  let trackEl = $state<HTMLDivElement | undefined>(undefined);
  let trackOffset = $state(0);
  let slidesLengthSynced = $state(slides.length);
  let loopSnapTimer: ReturnType<typeof setTimeout> | undefined;
  let isLoopSnapping = $state(false);
  let isAnimating = $state(false);
  let animLockTimer: ReturnType<typeof setTimeout> | undefined;

  const count = $derived(slides.length);
  const LOOP_TRANSITION_MS = 520;

  /** Trois copies pour boucler sans sauter d’un clone extrême. */
  function buildLoopSlides(items: HeroSlide[]): HeroSlide[] {
    const n = items.length;
    if (n <= 1) return items;
    return [...items, ...items, ...items];
  }

  const trackSlides = $derived(buildLoopSlides(slides));

  /** Copie du milieu : indices `count` … `2*count - 1`. */
  const loopStartIndex = $derived(count <= 1 ? 0 : count);

  const loopEndIndex = $derived(count <= 1 ? 0 : count * 2 - 1);

  const logicalIndex = $derived.by(() => {
    if (count <= 1) return 0;
    return ((trackIndex - loopStartIndex) % count + count) % count;
  });

  function goToLogical(target: number) {
    if (count === 0 || isLoopSnapping || isAnimating) return;
    clearLoopSnapTimer();
    if (count === 1) {
      trackIndex = 0;
      trackOffset = computeTrackOffset(0);
      return;
    }
    if (target === logicalIndex) return;
    beginAnimation();
    moveToIndex(count + target);
  }

  /** Met à jour index + offset ensemble (évite la désync avec l’effet réactif). */
  function moveToIndex(index: number) {
    trackIndex = index;
    trackOffset = computeTrackOffset(index);
  }

  function enableTrackTransition() {
    requestAnimationFrame(() => {
      trackOffset = computeTrackOffset(trackIndex);
      requestAnimationFrame(() => {
        transitionEnabled = true;
        trackLayoutReady = true;
      });
    });
  }

  function trackGapPx(): number {
    const track = trackEl;
    if (!track) return 20;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
    return Number.isFinite(gap) ? gap : 20;
  }

  function isOutOfLoopBand(): boolean {
    return count > 1 && (trackIndex < loopStartIndex || trackIndex > loopEndIndex);
  }

  function prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function measureSlideStride(): { width: number; gap: number } {
    const track = trackEl;
    const gap = trackGapPx();
    const slide = track?.querySelector<HTMLElement>(".slide");
    const width = slide?.getBoundingClientRect().width ?? slide?.offsetWidth ?? 0;
    return { width, gap };
  }

  function computeTrackOffset(index: number): number {
    const viewport = viewportEl;
    if (!viewport) return trackOffset;
    const { width, gap } = measureSlideStride();
    if (!width) return trackOffset;
    return (viewport.clientWidth - width) / 2 - index * (width + gap);
  }

  async function jumpWithoutAnimation(nextIndex: number) {
    isLoopSnapping = true;
    transitionEnabled = false;
    await tick();
    moveToIndex(nextIndex);
    await tick();
    requestAnimationFrame(() => {
      trackOffset = computeTrackOffset(nextIndex);
      transitionEnabled = true;
      isLoopSnapping = false;
      endAnimation();
    });
  }

  function clearLoopSnapTimer() {
    if (loopSnapTimer !== undefined) {
      clearTimeout(loopSnapTimer);
      loopSnapTimer = undefined;
    }
  }

  function normalizeTrackAfterLoop() {
    if (count <= 1 || !isOutOfLoopBand()) return;
    clearLoopSnapTimer();
    const li = logicalIndex;
    void jumpWithoutAnimation(loopStartIndex + li);
  }

  function scheduleLoopSnapFallback() {
    clearLoopSnapTimer();
    if (!isOutOfLoopBand()) return;
    loopSnapTimer = setTimeout(() => {
      loopSnapTimer = undefined;
      if (isOutOfLoopBand()) normalizeTrackAfterLoop();
    }, LOOP_TRANSITION_MS + 50);
  }

  function beginAnimation() {
    isAnimating = true;
    if (animLockTimer !== undefined) clearTimeout(animLockTimer);
    animLockTimer = setTimeout(() => {
      animLockTimer = undefined;
      isAnimating = false;
    }, LOOP_TRANSITION_MS + 80);
  }

  function endAnimation() {
    if (animLockTimer !== undefined) {
      clearTimeout(animLockTimer);
      animLockTimer = undefined;
    }
    isAnimating = false;
  }

  function onTrackTransitionEnd(e: TransitionEvent) {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    clearLoopSnapTimer();
    if (isOutOfLoopBand()) normalizeTrackAfterLoop();
    else endAnimation();
  }

  async function afterSlideChange() {
    await tick();
    if (!isOutOfLoopBand()) return;
    if (prefersReducedMotion()) {
      normalizeTrackAfterLoop();
      return;
    }
    scheduleLoopSnapFallback();
  }

  function next() {
    if (count <= 1 || isLoopSnapping || isAnimating) return;
    if (isOutOfLoopBand()) {
      normalizeTrackAfterLoop();
      return;
    }
    beginAnimation();
    if (trackIndex >= loopEndIndex) {
      moveToIndex(loopEndIndex + 1);
      void afterSlideChange();
      return;
    }
    moveToIndex(trackIndex + 1);
  }

  function prev() {
    if (count <= 1 || isLoopSnapping || isAnimating) return;
    if (isOutOfLoopBand()) {
      normalizeTrackAfterLoop();
      return;
    }
    beginAnimation();
    if (trackIndex <= loopStartIndex) {
      moveToIndex(loopStartIndex - 1);
      void afterSlideChange();
      return;
    }
    moveToIndex(trackIndex - 1);
  }

  function updateTrackPosition() {
    trackOffset = computeTrackOffset(trackIndex);
  }

  $effect(() => {
    const viewport = viewportEl;
    const track = trackEl;
    if (!viewport || !track || trackLayoutReady) return;

    transitionEnabled = false;
    const index = count <= 1 ? 0 : loopStartIndex;
    trackIndex = index;
    trackOffset = computeTrackOffset(index);
    enableTrackTransition();
  });

  $effect(() => {
    const n = slides.length;
    if (n === slidesLengthSynced) return;
    slidesLengthSynced = n;
    if (!trackLayoutReady) return;
    const index = n <= 1 ? 0 : n;
    void jumpWithoutAnimation(index);
  });

  $effect(() => {
    const viewport = viewportEl;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (!trackLayoutReady) return;
      const prev = transitionEnabled;
      transitionEnabled = false;
      updateTrackPosition();
      transitionEnabled = prev;
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  });

  $effect(() => {
    if (typeof window === "undefined" || count <= 1 || paused || !trackLayoutReady)
      return;
    const id = window.setInterval(() => {
      void next();
    }, autoplayMs);
    return () => window.clearInterval(id);
  });

  $effect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  $effect(() => {
    return () => {
      clearLoopSnapTimer();
      if (animLockTimer !== undefined) clearTimeout(animLockTimer);
    };
  });
</script>

{#if count > 0}
  <section
    class="carousel"
    aria-roledescription="carousel"
    aria-label="À la une"
    onmouseenter={() => (paused = true)}
    onmouseleave={() => (paused = false)}
  >
    <div class="carousel-viewport" bind:this={viewportEl}>
      <div
        class="carousel-track"
        class:is-ready={trackLayoutReady}
        class:no-transition={!transitionEnabled}
        style:transform="translateX({trackOffset}px)"
        role="list"
        bind:this={trackEl}
        ontransitionend={onTrackTransitionEnd}
      >
          {#each trackSlides as slide, i (`${i}-${slide.id}`)}
            {@const isPhotoHero = slideUsesPhotoHero(slide)}
            {@const isActive = i === trackIndex}
            {@const tone = slideTone(slide)}
            <article
              id="carousel-slide-{i}"
              class="slide"
              class:slide-photo-hero={isPhotoHero}
              class:is-active={isActive}
              data-theme={slide.theme}
              data-tone={tone}
              data-slide-id={slide.id}
              role="listitem"
              aria-roledescription="slide"
              aria-label="{slide.title}"
              aria-hidden={!isActive}
              tabindex={isActive ? 0 : -1}
            >
              {#if isPhotoHero && slide.imageSrc}
                <div class="slide-visual">
                  <img src={slide.imageSrc} alt={slide.imageAlt ?? ""} />
                </div>
                <div class="slide-scrim" aria-hidden="true"></div>
              {/if}
              <div class="slide-copy">
                {#if slide.eyebrow}
                  <p class="eyebrow">{slide.eyebrow}</p>
                {/if}
                <h2 class="slide-title">{slide.title}</h2>
                {#if slide.subtitle}
                  <p class="slide-subtitle">{slide.subtitle}</p>
                {/if}
                {#if slide.body}
                  <p class="slide-body">{slide.body}</p>
                {/if}
                <div class="slide-actions">
                  {#if notifySlideId && slide.id === notifySlideId && notify}
                    <div class="slide-notify">
                      {@render notify()}
                    </div>
                  {:else if slide.ctaLabel && slide.ctaHref}
                    <a
                      class={slideBtnClass(tone)}
                      class:btn-external={slide.ctaExternal}
                      href={slide.ctaHref}
                      target={slide.ctaExternal ? "_blank" : undefined}
                      rel={slide.ctaExternal ? "noopener noreferrer" : undefined}
                      tabindex={isActive ? undefined : -1}
                    >
                      {slide.ctaLabel}
                    </a>
                  {/if}
                </div>
              </div>

              {#if slide.imageSrc && !isPhotoHero}
                <div class="slide-visual">
                  <img src={slide.imageSrc} alt={slide.imageAlt ?? ""} />
                </div>
              {/if}
            </article>
          {/each}
      </div>
    </div>

    <div class="carousel-footer">
      <div class="carousel-footer-inner">
        <div
          class="dots"
          role="tablist"
          aria-label="Choisir une diapositive"
        >
          {#each slides as slide, i (slide.id)}
            <button
              type="button"
              role="tab"
              class="dot"
              aria-selected={i === logicalIndex}
              aria-controls={count <= 1
                ? "carousel-slide-0"
                : `carousel-slide-${count + i}`}
              aria-label={slide.title}
              onclick={() => goToLogical(i)}
            ></button>
          {/each}
        </div>

        {#if count > 1}
          <div class="arrows">
            <button
              type="button"
              class="arrow"
              aria-label="Diapositive précédente"
              onclick={prev}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              class="arrow"
              aria-label="Diapositive suivante"
              onclick={next}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 18l6-6-6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </section>
{/if}

<style>
  .carousel {
    --carousel-slide-width: var(--mp-shell-inner);
    padding: 0 0 2.5rem;
    overflow: hidden;
  }

  /* Viewport bord à bord : la slide active reste centrée (largeur site), les voisines dépassent sur les côtés */
  .carousel-viewport {
    overflow: hidden;
    width: 100vw;
    max-width: 100%;
    margin-left: calc(50% - 50vw);
  }

  .carousel-track {
    display: flex;
    gap: 20px;
    align-items: stretch;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .carousel-track:not(.is-ready) {
    visibility: hidden;
  }

  .carousel-track.no-transition {
    transition: none;
  }

  .slide {
    --slide-height: 640px;
    --slide-fade: #f4f6f8;
    --carousel-slide-width-fallback: min(
      calc(var(--mp-shell-max, 1180px) - 2 * var(--mp-shell-pad-x, 1.25rem)),
      calc(100vw - 2 * var(--mp-shell-pad-x, 1.25rem))
    );
    flex: 0 0 var(--carousel-slide-width, var(--carousel-slide-width-fallback));
    width: var(--carousel-slide-width, var(--carousel-slide-width-fallback));
    min-width: var(--carousel-slide-width, var(--carousel-slide-width-fallback));
    max-width: var(--carousel-slide-width, var(--carousel-slide-width-fallback));
    flex-shrink: 0;
    position: relative;
    min-height: var(--slide-height);
    border-radius: 1.35rem;
    overflow: hidden;
    box-sizing: border-box;
  }

  .slide:not(.slide-photo-hero) {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 2rem;
    align-items: stretch;
    height: var(--slide-height);
    padding: 3rem 3.25rem;
  }

  .slide-photo-hero {
    background: var(--slide-fade);
  }

  .slide-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
  }

  .slide-photo-hero .slide-copy {
    position: relative;
    z-index: 2;
    max-width: min(48%, 32rem);
    min-height: var(--slide-height);
    padding: 3rem 0 3rem 3.25rem;
    box-sizing: border-box;
  }

  .slide:not(.slide-photo-hero) .slide-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 0;
    height: 100%;
  }

  .slide:not(.slide-photo-hero) .slide-visual img {
    display: block;
    width: auto;
    max-width: min(100%, 380px);
    max-height: min(100%, 22rem);
    height: auto;
    object-fit: contain;
  }

  .slide:not(.slide-photo-hero)[data-theme="warm"] .slide-visual img {
    max-height: 100%;
    max-width: min(100%, 32rem);
    height: 100%;
    object-fit: contain;
  }

  .slide[data-theme="purple"]:not(.slide-photo-hero) {
    grid-template-columns: 0.85fr 1.15fr;
    gap: 3.5rem;
    padding-right: 0;
  }

  .slide:not(.slide-photo-hero)[data-theme="purple"] .slide-visual {
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

  .slide:not(.slide-photo-hero)[data-theme="purple"] .slide-visual img {
    height: 90%;
    width: auto;
    max-width: none;
    max-height: 90%;
    object-fit: contain;
    object-position: left center;
  }

  .slide-actions {
    margin-top: 0;
    padding-top: 1.5rem;
  }

  .slide-actions:empty {
    display: none;
    padding: 0;
  }

  .slide[data-theme="warm"] {
    --slide-fade: #f6efe4;
    background: linear-gradient(135deg, #f6efe4 0%, #e8d5c4 55%, #d4b896 100%);
  }

  .slide[data-theme="purple"] {
    --slide-fade: #5c3d6b;
    background: linear-gradient(135deg, #7a5589 0%, #654074 48%, #4a2f56 100%);
  }

  .slide[data-theme="neutral"] {
    --slide-fade: #f0f3f6;
    background: linear-gradient(135deg, #f4f6f8 0%, #e8edf2 55%, #d5dde6 100%);
  }

  /* Priorité sur les couleurs globales h2 / p du layout */
  .slide[data-tone="dark"] .eyebrow,
  .slide[data-tone="dark"] .slide-title,
  .slide[data-tone="dark"] .slide-subtitle {
    color: #1f2d3a;
  }

  .slide[data-tone="dark"] .slide-body {
    color: rgba(31, 45, 58, 0.88);
  }

  .slide[data-tone="light"] .eyebrow,
  .slide[data-tone="light"] .slide-title,
  .slide[data-tone="light"] .slide-subtitle {
    color: #fff;
  }

  .slide[data-tone="light"] .slide-body {
    color: rgba(255, 255, 255, 0.88);
  }

  .slide-photo-hero[data-theme="neutral"] {
    background: var(--slide-fade);
  }

  .eyebrow {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.82;
  }

  .slide-title {
    margin: 0 0 0.5rem;
    font-family: var(--mp-font-sans);
    font-size: clamp(2.15rem, 3.8vw, 3.15rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }

  .slide-subtitle {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.35;
    opacity: 0.9;
  }

  .slide-body {
    margin: 0;
    max-width: 44ch;
    font-size: 1.125rem;
    line-height: 1.55;
    opacity: 0.88;
  }

  .slide-notify :global(form) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    max-width: 28rem;
  }

  .slide-notify :global(input[type="email"]) {
    flex: 1;
    min-width: min(100%, 200px);
    padding: 0.7rem 1rem;
    border: 1px solid rgba(17, 24, 39, 0.12);
    border-radius: 999px;
    font: inherit;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.92);
    color: #1f2d3a;
  }

  .slide-notify :global(input[type="email"]:focus) {
    outline: 2px solid rgba(101, 64, 116, 0.35);
    outline-offset: 1px;
  }

  .slide-notify :global(input[type="email"]::placeholder) {
    color: rgba(31, 45, 58, 0.5);
  }

  .slide-photo-hero .slide-visual {
    position: absolute;
    inset: 0;
    width: 100%;
  }

  .slide-photo-hero .slide-visual img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .slide-scrim {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      var(--slide-fade) 0%,
      var(--slide-fade) 30%,
      color-mix(in srgb, var(--slide-fade) 85%, transparent) 48%,
      color-mix(in srgb, var(--slide-fade) 55%, transparent) 66%,
      color-mix(in srgb, var(--slide-fade) 25%, transparent) 84%,
      transparent 100%
    );
  }

  .carousel-footer {
    margin-top: 1rem;
  }

  .carousel-footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: var(--carousel-slide-width);
    max-width: calc(100vw - 2 * var(--mp-shell-pad-x, 1.25rem));
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
  }

  .dots {
    display: flex;
    gap: 0.45rem;
  }

  .dot {
    width: 0.55rem;
    height: 0.55rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(101, 64, 116, 0.22);
    cursor: pointer;
    transition:
      transform 0.15s ease,
      background 0.15s ease;
  }

  .dot[aria-selected="true"] {
    background: var(--mp-purple, #654074);
    transform: scale(1.15);
  }

  .dot:focus-visible {
    outline: 2px solid var(--mp-purple, #654074);
    outline-offset: 3px;
  }

  .arrows {
    display: flex;
    gap: 0.5rem;
  }

  .arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgba(17, 24, 39, 0.1);
    border-radius: 50%;
    background: #fff;
    color: #1f2d3a;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .arrow:hover {
    border-color: rgba(101, 64, 116, 0.35);
  }

  .arrow:focus-visible {
    outline: 2px solid var(--mp-purple, #654074);
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    .slide {
      --slide-height: auto;
    }

    .slide:not(.slide-photo-hero) {
      grid-template-columns: 1fr;
      height: auto;
      min-height: 0;
      padding: 1.75rem 1.5rem 1.5rem;
    }

    .slide:not(.slide-photo-hero) .slide-visual {
      order: -1;
      height: auto;
      min-height: 12rem;
    }

    .slide[data-theme="purple"]:not(.slide-photo-hero) {
      grid-template-columns: 1fr;
      gap: 0;
      padding: 1.75rem 1.5rem 1.5rem;
    }

    .slide:not(.slide-photo-hero)[data-theme="purple"] .slide-visual {
      margin: 0;
      height: auto;
      min-height: 12rem;
      justify-content: center;
      overflow: visible;
    }

    .slide:not(.slide-photo-hero)[data-theme="purple"] .slide-visual img {
      height: auto;
      max-width: min(85vw, 320px);
      max-height: 16rem;
      object-position: center;
    }

    .slide:not(.slide-photo-hero) .slide-visual img {
      max-width: min(72vw, 280px);
      max-height: 14rem;
      height: auto;
    }

    .slide:not(.slide-photo-hero)[data-theme="warm"] .slide-visual img {
      max-width: min(85vw, 280px);
      max-height: 18rem;
    }

    .slide-photo-hero .slide-visual {
      position: relative;
      width: 100%;
      height: 14rem;
    }

    .slide-photo-hero .slide-scrim {
      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--slide-fade) 40%, transparent) 55%,
        var(--slide-fade) 100%
      );
    }

    .slide-photo-hero .slide-copy {
      max-width: none;
      min-height: 0;
      padding: 1.25rem 1.5rem 1.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .carousel-track:not(.no-transition) {
      transition: none;
    }
  }
</style>
