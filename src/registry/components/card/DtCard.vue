<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  bordered?: boolean
  shadow?: boolean
  padding?: boolean
}>(), {
  bordered: true,
  shadow: false,
  padding: true,
})

const classes = computed(() => [
  'dt-card',
  props.bordered && 'dt-card--bordered',
  props.shadow && 'dt-card--shadow',
  props.padding && 'dt-card--padding',
].filter(Boolean))
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-card {
  background-color: var(--dt-color-background);
  border-radius: var(--dt-radius-lg);
  overflow: hidden;
}

.dt-card--bordered {
  border: 1px solid var(--dt-color-border);
}

.dt-card--shadow {
  box-shadow: var(--dt-shadow-md);
}

.dt-card--padding {
  padding: var(--dt-space-6);
}
</style>
