<script setup lang="ts">
import { computed } from 'vue'

export type BadgeGroupColor = 'gray' | 'brand' | 'error' | 'warning' | 'success'
export type BadgeGroupSize = 'md' | 'lg'
export type BadgeGroupType = 'pill' | 'modern'
export type BadgeGroupPosition = 'leading' | 'trailing'

const props = withDefaults(defineProps<{
  color?: BadgeGroupColor
  size?: BadgeGroupSize
  type?: BadgeGroupType
  position?: BadgeGroupPosition
  /** Pill / badge text. */
  label?: string
  /** Body text. */
  text?: string
  /** If set, the whole group renders as an <a>. */
  href?: string
  /** Target attribute when href is set. */
  target?: '_self' | '_blank' | '_parent' | '_top'
  /** Show the built-in arrow on the trailing side. Defaults to true. */
  arrow?: boolean
}>(), {
  color: 'gray',
  size: 'md',
  type: 'pill',
  position: 'leading',
  arrow: true,
})

const tag = computed(() => (props.href ? 'a' : 'div'))

const rootClasses = computed(() => [
  'dt-badge-group',
  `dt-badge-group--${props.type}`,
  `dt-badge-group--${props.size}`,
  `dt-badge-group--${props.color}`,
  `dt-badge-group--${props.position}`,
])
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="href ? target : undefined"
    :rel="href && target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="rootClasses"
  >
    <!-- Leading position: pill (or modern badge) on the left, body on the right -->
    <template v-if="position === 'leading'">
      <span class="dt-badge-group__pill">
        <span v-if="type === 'modern'" class="dt-badge-group__dot" aria-hidden="true" />
        <span class="dt-badge-group__label">
          <slot name="label">{{ label }}</slot>
        </span>
      </span>
      <span class="dt-badge-group__body">
        <span class="dt-badge-group__text">
          <slot>{{ text }}</slot>
        </span>
        <span v-if="arrow" class="dt-badge-group__arrow" aria-hidden="true">
          <slot name="arrow">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </slot>
        </span>
      </span>
    </template>

    <!-- Trailing position: body on the left, pill (arrow inside) on the right -->
    <template v-else>
      <span class="dt-badge-group__body">
        <span class="dt-badge-group__text">
          <slot>{{ text }}</slot>
        </span>
      </span>
      <span class="dt-badge-group__pill">
        <span v-if="type === 'modern'" class="dt-badge-group__dot" aria-hidden="true" />
        <span class="dt-badge-group__label">
          <slot name="label">{{ label }}</slot>
        </span>
        <span v-if="arrow" class="dt-badge-group__arrow dt-badge-group__arrow--inside" aria-hidden="true">
          <slot name="arrow">
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </slot>
        </span>
      </span>
    </template>
  </component>
</template>

<style scoped>
/* ── Root container ─────────────────────────── */
.dt-badge-group {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-md);
  border: 1px solid var(--dt-color-border);
  background: var(--dt-color-background);
  box-shadow: var(--dt-shadow-xs);
  text-decoration: none;
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-medium);
  white-space: nowrap;
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

/* Position-specific outer padding */
.dt-badge-group--leading {
  padding: var(--dt-spacing-xs) var(--dt-spacing-md) var(--dt-spacing-xs) var(--dt-spacing-xs);
}
.dt-badge-group--trailing {
  padding: var(--dt-spacing-xs) var(--dt-spacing-xs) var(--dt-spacing-xs) var(--dt-spacing-lg);
}

/* Shape: pill type = full radius, modern type = small radius */
.dt-badge-group--pill   { border-radius: var(--dt-radius-full); }
.dt-badge-group--modern { border-radius: var(--dt-radius-sm); }

/* Anchor reset */
a.dt-badge-group { color: inherit; }

/* ── Inner pill / badge ─────────────────────── */
.dt-badge-group__pill {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  background: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  box-shadow: var(--dt-shadow-xs);
  font-weight: var(--dt-font-medium);
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

.dt-badge-group--pill .dt-badge-group__pill   { border-radius: var(--dt-radius-full); }
.dt-badge-group--modern .dt-badge-group__pill { border-radius: var(--dt-radius-xs); gap: var(--dt-spacing-xs); }

/* ── Body (text + optional arrow) ───────────── */
.dt-badge-group__body {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-xs);
  flex-shrink: 0;
}

.dt-badge-group__text {
  color: var(--dt-gray-700);
}

.dt-badge-group__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
}
.dt-badge-group__arrow :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ── Sizes ──────────────────────────────────── */
.dt-badge-group--md .dt-badge-group__pill {
  height: 22px;
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
}
.dt-badge-group--md .dt-badge-group__text {
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
}
.dt-badge-group--md .dt-badge-group__arrow         { width: 16px; height: 16px; }
.dt-badge-group--md .dt-badge-group__arrow--inside { width: 12px; height: 12px; }

.dt-badge-group--lg .dt-badge-group__pill {
  height: 24px;
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-badge-group--lg .dt-badge-group__text {
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-badge-group--lg .dt-badge-group__arrow         { width: 16px; height: 16px; }
.dt-badge-group--lg .dt-badge-group__arrow--inside { width: 12px; height: 12px; }

/* Pill inner padding — depends on whether the arrow is inside (trailing) or not */
.dt-badge-group--pill .dt-badge-group--leading .dt-badge-group__pill,
.dt-badge-group--pill.dt-badge-group--leading .dt-badge-group__pill {
  padding: var(--dt-spacing-xxs) var(--dt-spacing-md);
}
.dt-badge-group--pill.dt-badge-group--trailing .dt-badge-group__pill {
  padding: var(--dt-spacing-xxs) 6px var(--dt-spacing-xxs) var(--dt-spacing-md);
  gap: var(--dt-spacing-xxs);
}
.dt-badge-group--lg.dt-badge-group--pill.dt-badge-group--leading .dt-badge-group__pill {
  padding: var(--dt-spacing-xxs) 10px;
}
.dt-badge-group--lg.dt-badge-group--pill.dt-badge-group--trailing .dt-badge-group__pill {
  padding: var(--dt-spacing-xxs) 6px var(--dt-spacing-xxs) 10px;
}

/* Modern type inner padding (slightly tighter to fit the dot) */
.dt-badge-group--modern .dt-badge-group__pill {
  padding: var(--dt-spacing-xxs) var(--dt-spacing-md) var(--dt-spacing-xxs) 6px;
}

/* ── Modern dot ─────────────────────────────── */
.dt-badge-group__dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: var(--dt-radius-full);
  background: var(--dt-gray-300);
  flex-shrink: 0;
}

/* ── Color: gray (default) ──────────────────── */
.dt-badge-group--pill.dt-badge-group--gray {
  background: var(--dt-gray-50);
  border-color: var(--dt-color-border);
}
.dt-badge-group--pill.dt-badge-group--gray:hover {
  background: var(--dt-gray-100);
}
.dt-badge-group--pill.dt-badge-group--gray .dt-badge-group__pill { color: var(--dt-gray-600); }
.dt-badge-group--pill.dt-badge-group--gray .dt-badge-group__text { color: var(--dt-gray-700); }

/* ── Color: brand ───────────────────────────── */
.dt-badge-group--pill.dt-badge-group--brand {
  background: var(--dt-brand-50);
  border-color: var(--dt-brand-200);
}
.dt-badge-group--pill.dt-badge-group--brand:hover {
  background: var(--dt-brand-100);
}
.dt-badge-group--pill.dt-badge-group--brand .dt-badge-group__pill {
  border-color: var(--dt-brand-200);
  color: var(--dt-brand-600);
}
.dt-badge-group--pill.dt-badge-group--brand .dt-badge-group__text { color: var(--dt-brand-600); }

/* ── Color: error ───────────────────────────── */
.dt-badge-group--pill.dt-badge-group--error {
  background: var(--dt-error-50);
  border-color: var(--dt-error-200);
}
.dt-badge-group--pill.dt-badge-group--error:hover {
  background: var(--dt-error-100);
}
.dt-badge-group--pill.dt-badge-group--error .dt-badge-group__pill {
  border-color: var(--dt-error-200);
  color: var(--dt-error-600);
}
.dt-badge-group--pill.dt-badge-group--error .dt-badge-group__text { color: var(--dt-error-600); }

/* ── Color: warning ─────────────────────────── */
.dt-badge-group--pill.dt-badge-group--warning {
  background: var(--dt-warning-50);
  border-color: var(--dt-warning-200);
}
.dt-badge-group--pill.dt-badge-group--warning:hover {
  background: var(--dt-warning-100);
}
.dt-badge-group--pill.dt-badge-group--warning .dt-badge-group__pill {
  border-color: var(--dt-warning-200);
  color: var(--dt-warning-600);
}
.dt-badge-group--pill.dt-badge-group--warning .dt-badge-group__text { color: var(--dt-warning-600); }

/* ── Color: success ─────────────────────────── */
.dt-badge-group--pill.dt-badge-group--success {
  background: var(--dt-success-50);
  border-color: var(--dt-success-200);
}
.dt-badge-group--pill.dt-badge-group--success:hover {
  background: var(--dt-success-100);
}
.dt-badge-group--pill.dt-badge-group--success .dt-badge-group__pill {
  border-color: var(--dt-success-200);
  color: var(--dt-success-600);
}
.dt-badge-group--pill.dt-badge-group--success .dt-badge-group__text { color: var(--dt-success-600); }

/* ── Modern type: container stays white, only the dot carries color ── */
.dt-badge-group--modern {
  background: var(--dt-color-background);
  border-color: var(--dt-color-border);
}
.dt-badge-group--modern:hover {
  background: var(--dt-gray-50);
}
.dt-badge-group--modern .dt-badge-group__pill {
  border-color: var(--dt-color-border);
  color: var(--dt-gray-600);
}
.dt-badge-group--modern .dt-badge-group__text {
  color: var(--dt-gray-700);
}

.dt-badge-group--modern.dt-badge-group--gray    .dt-badge-group__dot { background: var(--dt-gray-300); }
.dt-badge-group--modern.dt-badge-group--brand   .dt-badge-group__dot { background: var(--dt-brand-500); }
.dt-badge-group--modern.dt-badge-group--error   .dt-badge-group__dot { background: var(--dt-error-500); }
.dt-badge-group--modern.dt-badge-group--warning .dt-badge-group__dot { background: var(--dt-warning-500); }
.dt-badge-group--modern.dt-badge-group--success .dt-badge-group__dot { background: var(--dt-success-500); }

/* ── Focus visible (when href makes it an <a>) ── */
a.dt-badge-group:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}
</style>
