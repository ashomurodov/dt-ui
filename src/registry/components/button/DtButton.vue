<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'default' | 'outline' | 'transparent' | 'secondary-grey'
export type ButtonSize = '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'default',
  size: 'md',
})

const classes = computed(() => [
  'dt-button',
  `dt-button--${props.variant}`,
  `dt-button--size-${props.size}`,
  props.disabled && 'dt-button--disabled',
  props.loading && 'dt-button--loading',
].filter(Boolean))
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="dt-button__spinner" aria-hidden="true" />
    <span v-if="$slots['icon-left']" class="dt-button__icon">
      <slot name="icon-left" />
    </span>
    <slot />
    <span v-if="$slots['icon-right']" class="dt-button__icon">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<style scoped>
.dt-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-spacing-md);
  font-weight: var(--dt-font-medium);
  font-family: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
  transition: background-color var(--dt-transition-base),
    border-color var(--dt-transition-base),
    color var(--dt-transition-base);
}

/* ── Variants ───────────────────────────────
   Figma: Default / Outline / Transparent / Secondary-Grey
*/
.dt-button--default {
  background: var(--dt-color-accent);
  border-color: var(--dt-color-accent);
  color: var(--dt-color-white);
}
.dt-button--default:hover:not(:disabled) {
  background: var(--dt-color-accent-hover);
  border-color: var(--dt-color-accent-hover);
}
.dt-button--default:active:not(:disabled) {
  background: var(--dt-color-accent-active);
  border-color: var(--dt-color-accent-active);
}

.dt-button--outline {
  background: var(--dt-color-background);
  border-color: var(--dt-color-border);
  color: var(--dt-gray-800);
}
.dt-button--outline:hover:not(:disabled) {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-border-hover);
}
.dt-button--outline:active:not(:disabled) {
  background: var(--dt-brand-100);
  border-color: var(--dt-color-accent);
  color: var(--dt-color-accent);
}

.dt-button--transparent {
  background: transparent;
  border-color: transparent;
  color: var(--dt-color-accent);
}
.dt-button--transparent:hover:not(:disabled) {
  background: var(--dt-brand-100);
}
.dt-button--transparent:active:not(:disabled) {
  background: var(--dt-brand-100);
  color: var(--dt-color-accent-hover);
}

.dt-button--secondary-grey {
  background: var(--dt-gray-500);
  border-color: var(--dt-gray-500);
  color: var(--dt-color-white);
}
.dt-button--secondary-grey:hover:not(:disabled) {
  background: var(--dt-gray-700);
  border-color: var(--dt-gray-700);
}
.dt-button--secondary-grey:active:not(:disabled) {
  background: var(--dt-gray-600);
  border-color: var(--dt-gray-600);
}

/* ── Sizes (Figma: 3xl / 2xl / xl / lg / md / sm / xs / 2xs) ──
   Height + horizontal padding from Figma specs; vertical centering via flex.
*/
.dt-button--size-3xl {
  height: 60px;
  padding: 0 var(--dt-spacing-4xl);     /* 32px */
  border-radius: var(--dt-radius-xl);   /* 20px */
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}
.dt-button--size-2xl {
  height: 56px;
  padding: 0 var(--dt-spacing-3xl);     /* 24px */
  border-radius: var(--dt-radius-lg);   /* 16px */
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}
.dt-button--size-xl {
  height: 48px;
  padding: 0 var(--dt-spacing-3xl);     /* 24px */
  border-radius: var(--dt-radius-lg);   /* 16px */
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}
.dt-button--size-lg {
  height: 44px;
  padding: 0 var(--dt-spacing-2xl);     /* 20px */
  border-radius: var(--dt-radius-md);   /* 12px */
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}
.dt-button--size-md {
  height: 40px;
  padding: 0 var(--dt-spacing-2xl);     /* 20px */
  border-radius: var(--dt-radius-md);   /* 12px */
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-button--size-sm {
  height: 36px;
  padding: 0 var(--dt-spacing-xl);      /* 16px */
  border-radius: var(--dt-radius-md);   /* 12px */
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-button--size-xs {
  height: 32px;
  padding: 0 var(--dt-spacing-xl);      /* 16px */
  border-radius: var(--dt-radius-sm);   /* 8px */
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-button--size-2xs {
  height: 24px;
  padding: 0 var(--dt-spacing-lg);      /* 12px */
  border-radius: var(--dt-radius-xs);   /* 6px */
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
  gap: var(--dt-spacing-xs);
}

/* ── Icons: size paired with text size ──── */
.dt-button--size-3xl .dt-button__icon,
.dt-button--size-2xl .dt-button__icon,
.dt-button--size-xl .dt-button__icon,
.dt-button--size-lg .dt-button__icon {
  width: 20px;
  height: 20px;
}
.dt-button--size-md .dt-button__icon,
.dt-button--size-sm .dt-button__icon,
.dt-button--size-xs .dt-button__icon {
  width: 16px;
  height: 16px;
}
.dt-button--size-2xs .dt-button__icon {
  width: 14px;
  height: 14px;
}

.dt-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dt-button__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ── States ──────────────────────────────── */
.dt-button:disabled,
.dt-button--disabled {
  background: var(--dt-color-disabled-bg);
  border-color: var(--dt-color-disabled-bg);
  color: var(--dt-color-disabled-text);
  cursor: not-allowed;
}

.dt-button--loading {
  pointer-events: none;
}

/* Focus ring: Figma uses a 2px outer ring offset by 5px, one radius step bigger */
.dt-button:focus-visible {
  outline: none;
}
.dt-button:focus-visible::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 2px solid var(--dt-color-ring);
  pointer-events: none;
}
.dt-button--size-3xl:focus-visible::after { border-radius: calc(var(--dt-radius-xl) + 4px); }
.dt-button--size-2xl:focus-visible::after,
.dt-button--size-xl:focus-visible::after  { border-radius: calc(var(--dt-radius-lg) + 4px); }
.dt-button--size-lg:focus-visible::after,
.dt-button--size-md:focus-visible::after,
.dt-button--size-sm:focus-visible::after  { border-radius: calc(var(--dt-radius-md) + 4px); }
.dt-button--size-xs:focus-visible::after  { border-radius: calc(var(--dt-radius-sm) + 4px); }
.dt-button--size-2xs:focus-visible::after { border-radius: calc(var(--dt-radius-xs) + 4px); }

/* ── Spinner ─────────────────────────────── */
.dt-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--dt-radius-full);
  animation: dt-spin 0.6s linear infinite;
}

@keyframes dt-spin {
  to { transform: rotate(360deg); }
}
</style>
