<script setup lang="ts">
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
} from 'reka-ui'

const props = withDefaults(defineProps<{
  value: string | number
  label?: string
  disabled?: boolean
}>(), {
  disabled: false,
})
</script>

<template>
  <SelectItem
    class="dt-select-item"
    :value="value"
    :disabled="disabled"
    :text-value="label || String(value)"
    v-bind="$attrs"
  >
    <SelectItemIndicator class="dt-select-item__check" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </SelectItemIndicator>
    <SelectItemText class="dt-select-item__label">
      <slot>{{ label || value }}</slot>
    </SelectItemText>
  </SelectItem>
</template>

<style scoped>
.dt-select-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  padding: var(--dt-space-2) var(--dt-space-3);
  font-size: var(--dt-text-sm);
  color: var(--dt-color-text);
  cursor: pointer;
  transition: background-color var(--dt-transition-fast);
  user-select: none;
}

.dt-select-item:hover,
.dt-select-item[data-highlighted] {
  background-color: var(--dt-color-surface-hover);
}

.dt-select-item[data-state='checked'] {
  font-weight: 500;
}

.dt-select-item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

.dt-select-item__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  flex-shrink: 0;
  color: var(--dt-color-accent);
}

.dt-select-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
