<script setup lang="ts">
</script>

<template>
  <div class="dt-dialog-footer" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-spacing-md);
  padding-top: var(--dt-spacing-xl);
}
</style>
