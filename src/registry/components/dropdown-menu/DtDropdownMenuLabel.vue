<script setup lang="ts">
import { DropdownMenuLabel } from 'reka-ui'
</script>

<template>
  <DropdownMenuLabel class="dt-dropdown-label">
    <slot />
  </DropdownMenuLabel>
</template>

<style scoped>
.dt-dropdown-label {
  padding: var(--dt-spacing-md) var(--dt-spacing-lg) var(--dt-spacing-xs);
  font-family: var(--dt-font-family);
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
  font-weight: var(--dt-font-semibold);
  color: var(--dt-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  user-select: none;
}
</style>
