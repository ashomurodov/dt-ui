<script setup lang="ts">
</script>

<template>
  <div class="dt-card-footer" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-card-footer {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  padding-top: var(--dt-space-4);
}
</style>
