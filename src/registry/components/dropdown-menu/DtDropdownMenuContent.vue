<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
} from 'reka-ui'

// The root is <DropdownMenuPortal>, which renders a Teleport — a fragment, not an element.
// Vue cannot auto-inherit fallthrough attrs onto a fragment root: it drops them
// and warns "Extraneous non-props attributes ... could not be automatically
// inherited". They're already bound explicitly to the content node below.
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  avoidCollisions?: boolean
  minWidth?: string
}>(), {
  side: 'bottom',
  sideOffset: 6,
  align: 'start',
  alignOffset: 0,
  avoidCollisions: true,
  minWidth: '13.5rem',
})
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      class="dt-dropdown-content"
      :side="side"
      :side-offset="sideOffset"
      :align="align"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :style="{ minWidth }"
      v-bind="$attrs"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>

<style>
.dt-dropdown-content {
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

.dt-dropdown-content[data-state='open'] {
  animation: dt-dropdown-content-in var(--dt-transition-fast);
}

.dt-dropdown-content[data-state='closed'] {
  animation: dt-dropdown-content-out var(--dt-transition-fast);
}

@keyframes dt-dropdown-content-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dt-dropdown-content-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
</style>
