<script setup lang="ts">
</script>

<template>
  <div class="dt-card-content" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-card-content {
  font-size: var(--dt-text-base);
  color: var(--dt-color-text);
}
</style>
