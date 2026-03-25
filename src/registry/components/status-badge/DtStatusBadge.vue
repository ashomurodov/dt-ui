<script lang="ts" setup>
export type StatusVariant = 'active' | 'inactive' | 'moderation' | 'canceled' | 'rejected' | 'blocked'

defineProps<{
  variant: StatusVariant
}>()
</script>

<template>
  <span class="dt-status-badge" :class="`dt-status-badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.dt-status-badge {
  display: inline-flex;
  padding: 3px 6px;
  border-radius: var(--dt-radius-sm);
  font-size: var(--dt-text-xs);
  font-weight: var(--dt-font-medium);
  white-space: nowrap;
}

.dt-status-badge--active {
  background: var(--dt-success-100);
  color: var(--dt-success-600);
}

.dt-status-badge--inactive {
  background: var(--dt-gray-100);
  color: var(--dt-gray-700);
}

.dt-status-badge--moderation {
  background: var(--dt-warning-100);
  color: var(--dt-warning-600);
}

.dt-status-badge--canceled,
.dt-status-badge--rejected,
.dt-status-badge--blocked {
  background: var(--dt-error-100);
  color: var(--dt-error-500);
}
</style>
