<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'

withDefaults(defineProps<{
  asChild?: boolean
}>(), {
  asChild: true,
})
</script>

<template>
  <DropdownMenuTrigger
    class="dt-dropdown-trigger"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <slot />
  </DropdownMenuTrigger>
</template>

<style scoped>
.dt-dropdown-trigger {
  display: inline-flex;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
