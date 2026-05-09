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
  gap: var(--dt-spacing-md);
  padding-top: var(--dt-spacing-xl);
}
</style>
