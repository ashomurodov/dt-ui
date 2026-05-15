<script setup lang="ts">
import { DropdownMenuPortal, DropdownMenuSubContent } from 'reka-ui'

withDefaults(defineProps<{
  sideOffset?: number
  alignOffset?: number
  minWidth?: string
}>(), {
  sideOffset: 6,
  alignOffset: -4,
  minWidth: '13.5rem',
})
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuSubContent
      class="dt-dropdown-sub-content"
      :side-offset="sideOffset"
      :align-offset="alignOffset"
      :style="{ minWidth }"
      v-bind="$attrs"
    >
      <slot />
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</template>

<style>
.dt-dropdown-sub-content {
  z-index: var(--dt-z-dropdown);
  max-height: var(--reka-dropdown-menu-content-available-height);
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-sm);
  box-shadow: var(--dt-shadow-lg);
  padding: var(--dt-spacing-xs) 0;
  overflow-y: auto;
  outline: none;
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
  will-change: transform, opacity;
}

.dt-dropdown-sub-content[data-state='open'] {
  animation: dt-dropdown-sub-content-in var(--dt-transition-fast);
}

.dt-dropdown-sub-content[data-state='closed'] {
  animation: dt-dropdown-sub-content-out var(--dt-transition-fast);
}

@keyframes dt-dropdown-sub-content-in {
  from {
    opacity: 0;
    transform: translateX(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes dt-dropdown-sub-content-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-4px) scale(0.98);
  }
}
</style>
