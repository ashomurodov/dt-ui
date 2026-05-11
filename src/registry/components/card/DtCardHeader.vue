<script setup lang="ts">
</script>

<template>
  <div class="dt-card-header" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-card-header {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-xs);
  padding-bottom: var(--dt-spacing-xl);
}

.dt-card-header :deep(h1),
.dt-card-header :deep(h2),
.dt-card-header :deep(h3),
.dt-card-header :deep(h4) {
  font-weight: 600;
  line-height: 1.25;
  color: var(--dt-color-text);
}

.dt-card-header :deep(p) {
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text-secondary);
}
</style>
