<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'

withDefaults(defineProps<{
  asChild?: boolean
}>(), {
  asChild: true,
})
</script>

<template>
  <DialogTrigger
    class="dt-dialog-trigger"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <slot />
  </DialogTrigger>
</template>

<style scoped>
.dt-dialog-trigger {
  display: inline-flex;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
