<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-spacing-md);
  font-weight: var(--dt-font-medium);
  cursor: pointer;
  border: 1px solid transparent;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  transition: background-color var(--dt-transition-base),
    border-color var(--dt-transition-base),
    color var(--dt-transition-base);
}

/* ── Variants ───────────────────────────── */
.dt-button--primary {
  background: var(--dt-color-accent);
  color: var(--dt-color-accent-foreground);
}
.dt-button--primary:hover:not(:disabled) {
  background: var(--dt-color-accent-hover);
}
.dt-button--primary:active:not(:disabled) {
  background: var(--dt-color-accent-active);
}

.dt-button--secondary {
  background: var(--dt-color-secondary);
  color: var(--dt-color-secondary-foreground);
}
.dt-button--secondary:hover:not(:disabled) {
  background: var(--dt-color-secondary-hover);
}
.dt-button--secondary:active:not(:disabled) {
  background: var(--dt-color-secondary-active);
}

.dt-button--outline {
  background: var(--dt-color-background);
  color: var(--dt-gray-800);
  border-color: var(--dt-color-border);
}
.dt-button--outline:hover:not(:disabled) {
  color: var(--dt-color-accent);
  border-color: var(--dt-color-accent);
}
.dt-button--outline:active:not(:disabled) {
  background: var(--dt-brand-100);
  color: var(--dt-color-accent);
  border-color: var(--dt-color-accent);
}

.dt-button--ghost {
  background: transparent;
  color: var(--dt-gray-800);
}
.dt-button--ghost:hover:not(:disabled) {
  background: var(--dt-brand-100);
  color: var(--dt-color-accent);
}
.dt-button--ghost:active:not(:disabled) {
  background: transparent;
  color: var(--dt-color-accent);
}

/* ── Sizes (Figma: xl/lg/md/sm/xs) ──────── */
.dt-button--size-xl {
  height: 56px;
  padding: 18px 24px;
  border-radius: var(--dt-radius-xl);
  font-size: var(--dt-text-base);
}
.dt-button--size-lg {
  height: 48px;
  padding: 16px 24px;
  border-radius: var(--dt-radius-lg);
  font-size: var(--dt-text-sm);
}
.dt-button--size-md {
  height: 40px;
  padding: 12px 18px;
  border-radius: var(--dt-radius-md);
  font-size: var(--dt-text-sm);
}
.dt-button--size-sm {
  height: 32px;
  padding: 8px 16px;
  border-radius: var(--dt-radius-sm);
  font-size: var(--dt-text-xs);
}
.dt-button--size-xs {
  height: 24px;
  padding: 4px 8px;
  border-radius: var(--dt-radius-xs);
  font-size: var(--dt-text-xs);
}

/* ── States ──────────────────────────────── */
.dt-button--disabled {
  background: var(--dt-color-disabled-bg);
  color: var(--dt-color-disabled-text);
  border-color: transparent;
  cursor: not-allowed;
}

.dt-button--loading {
  pointer-events: none;
}

.dt-button:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}

/* ── Spinner ─────────────────────────────── */
.dt-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--dt-radius-full);
  animation: dt-spin 0.6s linear infinite;
}

.dt-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@keyframes dt-spin {
  to { transform: rotate(360deg); }
}
</style>
