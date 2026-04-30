<script setup lang="ts">
import {
  SelectContent,
  SelectPortal,
  SelectViewport,
} from 'reka-ui'
</script>

<template>
  <SelectPortal>
    <SelectContent
      class="dt-select-content"
      position="popper"
      :side-offset="4"
      v-bind="$attrs"
    >
      <div v-if="$slots.search" class="dt-select-content__search">
        <slot name="search" />
      </div>
      <SelectViewport class="dt-select-content__list">
        <slot />
      </SelectViewport>
      <div v-if="$slots.empty" class="dt-select-content__empty">
        <slot name="empty" />
      </div>
    </SelectContent>
  </SelectPortal>
</template>

<style scoped>
.dt-select-content {
  z-index: var(--dt-z-dropdown);
  width: var(--reka-select-trigger-width);
  min-width: 12rem;
  max-height: min(15rem, var(--reka-select-content-available-height));
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-base);
  box-shadow: var(--dt-shadow-md);
  overflow-y: auto;
  padding: var(--dt-space-1) 0;
  transform-origin: var(--reka-select-content-transform-origin);
  will-change: transform, opacity;
}

.dt-select-content[data-state='open'] {
  animation: dt-select-content-in var(--dt-transition-fast);
}

.dt-select-content[data-state='closed'] {
  animation: dt-select-content-out var(--dt-transition-fast);
}

.dt-select-content__search {
  padding: var(--dt-space-2);
  border-bottom: 1px solid var(--dt-color-border);
}

.dt-select-content__list {
  display: flex;
  flex-direction: column;
}

.dt-select-content__empty {
  padding: var(--dt-space-4);
  text-align: center;
  font-size: var(--dt-text-sm);
  color: var(--dt-color-text-secondary);
}

@keyframes dt-select-content-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dt-select-content-out {
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
