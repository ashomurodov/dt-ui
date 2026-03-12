<script setup lang="ts">
import { inject } from 'vue'

const dialog = inject<{
  toggle: () => void
}>('dt-dialog')!
</script>

<template>
  <span class="dt-dialog-trigger" @click="dialog.toggle()" v-bind="$attrs">
    <slot />
  </span>
</template>

<style scoped>
.dt-dialog-trigger {
  display: inline-flex;
  cursor: pointer;
}
</style>
