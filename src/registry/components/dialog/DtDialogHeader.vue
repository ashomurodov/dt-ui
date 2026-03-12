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
  gap: var(--dt-space-1);
  padding-bottom: var(--dt-space-4);
}

.dt-dialog-header :deep(h1),
.dt-dialog-header :deep(h2),
.dt-dialog-header :deep(h3),
.dt-dialog-header :deep(h4) {
  font-size: var(--dt-font-size-lg);
  font-weight: 600;
  line-height: 1.25;
  color: var(--dt-foreground);
}

.dt-dialog-header :deep(p) {
  font-size: var(--dt-font-size-sm);
  color: var(--dt-muted-foreground);
}
</style>
