<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'gray' | 'green' | 'red' | 'blue' | 'orange' | 'yellow'
export type BadgeSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}>(), {
  variant: 'gray',
  size: 'md',
})

const classes = computed(() => [
  'dt-badge',
  `dt-badge--${props.variant}`,
  `dt-badge--size-${props.size}`,
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
  gap: var(--dt-spacing-xs);
  font-weight: var(--dt-font-medium);
  border-radius: var(--dt-radius-xs);
  white-space: nowrap;
  line-height: 1;
}

/* Sizes (Figma: SM/MD/LG) */
.dt-badge--size-sm {
  padding: 4px 6px;
  font-size: var(--dt-text-body-xs);
}
.dt-badge--size-md {
  padding: 4px 8px;
  font-size: var(--dt-text-body-sm);
}
.dt-badge--size-lg {
  padding: 4px 10px;
  font-size: var(--dt-text-body-sm);
}

/* Variants (Figma colors) */
.dt-badge--gray {
  background: var(--dt-gray-100);
  color: var(--dt-gray-800);
}

.dt-badge--green {
  background: var(--dt-success-100);
  color: var(--dt-success-600);
}

.dt-badge--red {
  background: var(--dt-error-100);
  color: var(--dt-error-500);
}

.dt-badge--blue {
  background: var(--dt-blue-100);
  color: var(--dt-blue-600);
}

.dt-badge--orange {
  background: var(--dt-amber-100);
  color: var(--dt-amber-700);
}

.dt-badge--yellow {
  background: var(--dt-warning-100);
  color: var(--dt-warning-700);
}

/* Dot */
.dt-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
</style>
