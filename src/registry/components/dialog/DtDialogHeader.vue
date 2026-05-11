<script setup lang="ts">
</script>

<template>
  <div class="dt-dialog-header" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-dialog-header {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-xs);
  padding-bottom: var(--dt-spacing-xl);
}

.dt-dialog-header :deep(h1),
.dt-dialog-header :deep(h2),
.dt-dialog-header :deep(h3),
.dt-dialog-header :deep(h4) {
  font-size: var(--dt-text-h5);
  font-weight: 600;
  line-height: 1.25;
  color: var(--dt-color-text);
}

.dt-dialog-header :deep(p) {
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text-secondary);
}
</style>
