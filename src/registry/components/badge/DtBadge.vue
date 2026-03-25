<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
export type BadgeSize = 'sm' | 'default'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}>(), {
  variant: 'default',
  size: 'default',
})

const classes = computed(() => [
  'dt-badge',
  `dt-badge--${props.variant}`,
  `dt-badge--${props.size}`,
  props.dot && 'dt-badge--dot',
].filter(Boolean))
</script>

<template>
  <span :class="classes" v-bind="$attrs">
    <span v-if="dot" class="dt-badge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.dt-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-1);
  font-weight: 500;
  border-radius: var(--dt-radius-sm);
  white-space: nowrap;
  transition: background-color var(--dt-transition-base), color var(--dt-transition-base);
  border: 1px solid transparent;
  line-height: 1;
}

/* Sizes */
.dt-badge--sm {
  padding: 0.125rem 0.375rem;
  font-size: var(--dt-text-xs);
}
.dt-badge--default {
  padding: 0.25rem 0.5rem;
  font-size: var(--dt-text-xs);
}

/* Variants */
.dt-badge--default {
  background-color: var(--dt-color-accent-light);
  color: var(--dt-color-accent);
}

.dt-badge--secondary {
  background-color: var(--dt-color-background-tertiary);
  color: var(--dt-color-text-secondary);
}

.dt-badge--outline {
  border-color: var(--dt-color-border);
  background-color: transparent;
  color: var(--dt-color-text);
}

.dt-badge--destructive {
  background-color: var(--dt-color-error-light);
  color: var(--dt-color-error);
}

.dt-badge--success {
  background-color: var(--dt-color-success-light);
  color: var(--dt-color-success);
}

.dt-badge--warning {
  background-color: var(--dt-color-warning-light);
  color: var(--dt-color-warning);
}

/* Dot */
.dt-badge__dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: var(--dt-radius-full);
  background-color: currentColor;
  flex-shrink: 0;
}
</style>
