<script lang="ts" setup>
withDefaults(defineProps<{
  spacing?: string
}>(), {
  spacing: 'var(--dt-spacing-xl)',
})
</script>

<template>
  <div class="dt-divider" :style="{ marginBottom: spacing }" />
</template>

<style scoped>
.dt-divider {
  height: 1px;
  background: var(--dt-color-border-light);
}
</style>
