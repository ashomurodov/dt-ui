<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface DtTab {
  key: string
  label: string
  badge?: string
}

const props = defineProps<{
  tabs: DtTab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const trackRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const ready = ref(false)

/** Overflow state → drives the edge-fade masks. */
const overflowing = ref(false)
const atStart = ref(true)
const atEnd = ref(false)

/**
 * How much of the neighbouring tab to reveal when we scroll the active tab
 * into view — half of it, so the user always sees there's more to scroll.
 */
const PEEK_RATIO = 0.5
/** Breathing room at the true start/end where there is no neighbour to peek. */
const EDGE_GAP = 8

/** Last committed indicator geometry, in the track's layout coordinate space. */
let lastLeft = 0
let lastWidth = 0

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const buttons = (): HTMLElement[] =>
  trackRef.value
    ? Array.from(trackRef.value.querySelectorAll<HTMLElement>('.dt-tab-switcher__btn'))
    : []

const activeIndex = () => props.tabs.findIndex((t) => t.key === props.modelValue)

/** Place the indicator instantly, no transition. Layout coordinates. */
const setIndicatorInstant = (left: number, width: number) => {
  const el = indicatorRef.value
  if (!el) return
  el.style.transition = 'none'
  el.style.transform = 'translateX(0) scaleX(1)'
  el.style.left = left + 'px'
  el.style.width = width + 'px'
  lastLeft = left
  lastWidth = width
  ready.value = true
}

/**
 * FLIP the indicator from its current visual position to a new one.
 *
 * Everything is computed in the track's *layout* space (offset coordinates),
 * not the viewport — so the math stays correct while the track is scrolled or
 * mid-scroll. This is what keeps the indicator glued to its tab without the
 * jitter the old viewport-based math produced once the strip could scroll.
 */
const animateIndicator = (newLeft: number, newWidth: number) => {
  const el = indicatorRef.value
  const track = trackRef.value
  if (!el || !track || !ready.value || prefersReduced()) {
    setIndicatorInstant(newLeft, newWidth)
    return
  }

  // First: capture the current visual box (includes any in-flight transform),
  // then convert it into layout space by adding the current scroll offset.
  const elRect = el.getBoundingClientRect()
  const trackRect = track.getBoundingClientRect()
  const curLeft = elRect.left - trackRect.left + track.scrollLeft
  const curWidth = elRect.width

  // Last: snap to the target with no transform.
  el.style.transition = 'none'
  el.style.transform = 'translateX(0) scaleX(1)'
  el.style.left = newLeft + 'px'
  el.style.width = newWidth + 'px'

  // Invert: offset the indicator back to where it visually was.
  const dx = curLeft - newLeft
  const sx = newWidth === 0 ? 1 : curWidth / newWidth
  el.style.transform = `translateX(${dx}px) scaleX(${sx})`

  void el.offsetWidth // force reflow so the invert paints before the play

  // Play: animate back to identity. Runs on the compositor.
  el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.transform = 'translateX(0) scaleX(1)'

  lastLeft = newLeft
  lastWidth = newWidth
}

/**
 * Scroll the tab at `idx` into view, revealing ~half of the neighbour on the
 * side we scroll toward. No-op when it's already comfortably visible, so
 * manual scrolling is never yanked away from the user.
 */
const scrollIntoView = (idx: number, smooth: boolean) => {
  const track = trackRef.value
  const list = buttons()
  const btn = list[idx]
  if (!track || !btn) return

  const view = track.clientWidth
  const max = track.scrollWidth - view
  if (max <= 0) return

  const bLeft = btn.offsetLeft
  const bRight = bLeft + btn.offsetWidth
  const prev = list[idx - 1]
  const next = list[idx + 1]
  const leftPeek = prev ? Math.round(prev.offsetWidth * PEEK_RATIO) : EDGE_GAP
  const rightPeek = next ? Math.round(next.offsetWidth * PEEK_RATIO) : EDGE_GAP

  const cur = track.scrollLeft
  let target = cur
  if (bLeft - leftPeek < cur) {
    target = bLeft - leftPeek
  } else if (bRight + rightPeek > cur + view) {
    target = bRight + rightPeek - view
  }
  target = Math.max(0, Math.min(target, max))

  if (Math.abs(target - cur) < 1) return
  track.scrollTo({ left: target, behavior: smooth && !prefersReduced() ? 'smooth' : 'auto' })
}

const updateEdges = () => {
  const track = trackRef.value
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  overflowing.value = max > 1
  atStart.value = track.scrollLeft <= 1
  atEnd.value = track.scrollLeft >= max - 1
}

/** Sync indicator + scroll to the active tab. */
const syncTo = (idx: number, animate: boolean) => {
  const btn = buttons()[idx]
  if (!btn) return
  if (animate) animateIndicator(btn.offsetLeft, btn.offsetWidth)
  else setIndicatorInstant(btn.offsetLeft, btn.offsetWidth)
  scrollIntoView(idx, animate)
}

// A click only emits — the actual move is driven by the `modelValue` watcher
// below, so clicks and programmatic changes follow one identical path. If a
// controlled parent ignores the click, nothing moves, which is correct.
const onTabClick = (key: string) => {
  emit('update:modelValue', key)
}

const onFocusIn = (e: FocusEvent) => {
  const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('.dt-tab-switcher__btn')
  if (!target) return
  const idx = buttons().indexOf(target)
  if (idx >= 0) scrollIntoView(idx, true)
}

watch(
  () => props.modelValue,
  () => syncTo(activeIndex(), true),
)

// Tab set / labels / badges changed → widths shifted, re-sync without animating.
watch(
  () => props.tabs.map((t) => `${t.key}:${t.label}:${t.badge ?? ''}`).join('|'),
  async () => {
    await nextTick()
    syncTo(activeIndex(), false)
    updateEdges()
  },
)

let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  setIndicatorInstant(
    buttons()[activeIndex()]?.offsetLeft ?? 0,
    buttons()[activeIndex()]?.offsetWidth ?? 0,
  )
  scrollIntoView(activeIndex(), false)
  updateEdges()

  const track = trackRef.value
  if (track) {
    track.addEventListener('scroll', updateEdges, { passive: true })
    track.addEventListener('focusin', onFocusIn)
    ro = new ResizeObserver(() => {
      syncTo(activeIndex(), false)
      updateEdges()
    })
    ro.observe(track)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  const track = trackRef.value
  if (track) {
    track.removeEventListener('scroll', updateEdges)
    track.removeEventListener('focusin', onFocusIn)
  }
})
</script>

<template>
  <div
    class="dt-tab-switcher"
    :class="{
      'dt-tab-switcher--fade-start': overflowing && !atStart,
      'dt-tab-switcher--fade-end': overflowing && !atEnd,
    }"
  >
    <div ref="trackRef" class="dt-tab-switcher__track">
      <div ref="indicatorRef" class="dt-tab-switcher__indicator" />
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="dt-tab-switcher__btn"
        :class="{ 'dt-tab-switcher__btn--active': modelValue === tab.key }"
        @click="onTabClick(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="dt-tab-switcher__badge">{{ tab.badge }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* The pill: solid background + rounded frame. Keeps its fill while the inner
   track scrolls, so the edge fade never eats the pill itself. */
.dt-tab-switcher {
  display: inline-flex;
  max-width: 100%;
  background: var(--dt-color-background-tertiary);
  border-radius: var(--dt-radius-md);
  padding: 4px;
}

/* The scroll surface. Overflows horizontally; tabs keep their size. */
.dt-tab-switcher__track {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: var(--dt-radius-sm);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* legacy Edge */
  /* Edge fades — widths are 0 until the matching modifier turns them on. */
  --dt-tab-fade-start: 0px;
  --dt-tab-fade-end: 0px;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--dt-tab-fade-start),
    #000 calc(100% - var(--dt-tab-fade-end)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--dt-tab-fade-start),
    #000 calc(100% - var(--dt-tab-fade-end)),
    transparent 100%
  );
}
.dt-tab-switcher__track::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.dt-tab-switcher--fade-start .dt-tab-switcher__track {
  --dt-tab-fade-start: 24px;
}
.dt-tab-switcher--fade-end .dt-tab-switcher__track {
  --dt-tab-fade-end: 24px;
}

.dt-tab-switcher__indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  background: var(--dt-color-text);
  border-radius: var(--dt-radius-sm);
  z-index: 0;
  transform-origin: left center;
  will-change: transform;
}

.dt-tab-switcher__btn {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding: 10px 20px;
  border: none;
  border-radius: var(--dt-radius-sm);
  font-size: var(--dt-text-body-sm);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: color var(--dt-transition-fast);
  background: transparent;
  color: var(--dt-color-text-secondary);
  white-space: nowrap;
}

.dt-tab-switcher__btn:hover {
  color: var(--dt-color-text);
}

.dt-tab-switcher__btn:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: -2px;
}

.dt-tab-switcher__btn--active,
.dt-tab-switcher__btn--active:hover {
  color: var(--dt-color-background);
}

.dt-tab-switcher__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: var(--dt-radius-xs);
  font-size: var(--dt-text-body-xs);
  font-weight: 700;
  margin-left: 4px;
  background: var(--dt-color-error-light);
  color: var(--dt-color-error);
  transition: background var(--dt-transition-fast), color var(--dt-transition-fast);
}

.dt-tab-switcher__btn--active .dt-tab-switcher__badge {
  background: var(--dt-color-error);
  color: var(--dt-color-white);
}

@media (prefers-reduced-motion: reduce) {
  .dt-tab-switcher__indicator {
    transition: none !important;
  }
}
</style>
