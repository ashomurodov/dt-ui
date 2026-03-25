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
  font-weight: 500;
  white-space: nowrap;
}

.dt-status-badge--active {
  background: var(--dt-color-success-light);
  color: var(--dt-color-success);
}

.dt-status-badge--inactive {
  background: var(--dt-color-background-tertiary);
  color: var(--dt-color-text-tertiary);
}

.dt-status-badge--moderation {
  background: var(--dt-color-warning-light);
  color: var(--dt-color-warning);
}

.dt-status-badge--canceled,
.dt-status-badge--rejected,
.dt-status-badge--blocked {
  background: var(--dt-color-error-light);
  color: var(--dt-color-error);
}
</style>
