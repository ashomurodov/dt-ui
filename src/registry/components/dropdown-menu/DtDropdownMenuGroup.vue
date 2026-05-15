<script setup lang="ts">
import { DropdownMenuGroup } from 'reka-ui'
</script>

<template>
  <DropdownMenuGroup class="dt-dropdown-group">
    <slot />
  </DropdownMenuGroup>
</template>

<style scoped>
.dt-dropdown-group {
  display: flex;
  flex-direction: column;
}
</style>
