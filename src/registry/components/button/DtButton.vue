<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'default',
  size: 'default',
})

const classes = computed(() => [
  'dt-button',
  `dt-button--${props.variant}`,
  `dt-button--${props.size}`,
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
    <span v-if="$slots['icon-left']" class="dt-button__icon dt-button__icon--left">
      <slot name="icon-left" />
    </span>
    <slot />
    <span v-if="$slots['icon-right']" class="dt-button__icon dt-button__icon--right">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<style scoped>
.dt-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-2);
  font-weight: 500;
  border-radius: var(--dt-radius-md);
  transition: background-color var(--dt-transition-base),
    border-color var(--dt-transition-base),
    color var(--dt-transition-base),
    box-shadow var(--dt-transition-base);
  cursor: pointer;
  border: 1px solid transparent;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

/* Variants */
.dt-button--default {
  background-color: var(--dt-primary);
  color: var(--dt-primary-foreground);
}
.dt-button--default:hover {
  background-color: var(--dt-primary-hover);
}

.dt-button--secondary {
  background-color: var(--dt-secondary);
  color: var(--dt-secondary-foreground);
}
.dt-button--secondary:hover {
  background-color: var(--dt-secondary-hover);
}

.dt-button--outline {
  border-color: var(--dt-border);
  background-color: transparent;
  color: var(--dt-foreground);
}
.dt-button--outline:hover {
  background-color: var(--dt-accent);
  border-color: var(--dt-border-hover);
}

.dt-button--ghost {
  background-color: transparent;
  color: var(--dt-foreground);
}
.dt-button--ghost:hover {
  background-color: var(--dt-accent);
}

.dt-button--destructive {
  background-color: var(--dt-destructive);
  color: var(--dt-destructive-foreground);
}
.dt-button--destructive:hover {
  background-color: var(--dt-destructive-hover);
}

.dt-button--link {
  background-color: transparent;
  color: var(--dt-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.dt-button--link:hover {
  color: var(--dt-primary-hover);
}

/* Sizes */
.dt-button--sm {
  height: 2rem;
  padding: 0 0.75rem;
  font-size: var(--dt-font-size-sm);
}
.dt-button--default {
  height: 2.5rem;
  padding: 0 1rem;
  font-size: var(--dt-font-size-base);
}
.dt-button--lg {
  height: 2.75rem;
  padding: 0 1.5rem;
  font-size: var(--dt-font-size-lg);
}
.dt-button--icon {
  height: 2.5rem;
  width: 2.5rem;
  padding: 0;
}

/* States */
.dt-button--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.dt-button--loading {
  position: relative;
  pointer-events: none;
}

.dt-button:focus-visible {
  outline: 2px solid var(--dt-ring);
  outline-offset: 2px;
}

/* Spinner */
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
  to {
    transform: rotate(360deg);
  }
}
</style>
