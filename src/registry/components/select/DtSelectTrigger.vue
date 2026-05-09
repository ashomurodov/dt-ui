<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'
import {
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from 'reka-ui'

const ctx = inject<{
  placeholder: ComputedRef<string>
}>('dt-select')

const placeholder = computed(() => ctx?.placeholder.value ?? 'Select an option...')
</script>

<template>
  <SelectTrigger
    class="dt-select-trigger"
    v-bind="$attrs"
  >
    <span class="dt-select-trigger__value">
      <slot>
        <SelectValue :placeholder="placeholder" />
      </slot>
    </span>
    <SelectIcon class="dt-select-trigger__icon" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </SelectIcon>
  </SelectTrigger>
</template>

<style scoped>
.dt-select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.75rem;
  padding: 0 var(--dt-spacing-xl);
  font-size: var(--dt-text-sm);
  font-family: inherit;
  color: var(--dt-color-text);
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-md);
  cursor: pointer;
  transition: border-color var(--dt-transition-base),
    box-shadow var(--dt-transition-base);
  outline: none;
  text-align: left;
}

.dt-select-trigger:hover {
  border-color: var(--dt-color-border-hover);
}

.dt-select-trigger:focus-visible {
  border-color: var(--dt-color-ring);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dt-color-ring) 25%, transparent);
}

.dt-select-trigger[data-state='open'] {
  border-color: var(--dt-color-ring);
}

.dt-select-trigger__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dt-select-trigger__icon {
  display: inline-flex;
  align-items: center;
  margin-left: var(--dt-spacing-md);
  color: var(--dt-color-icon-secondary);
  transition: transform var(--dt-transition-base);
}

.dt-select-trigger[data-state='open'] .dt-select-trigger__icon {
  transform: rotate(180deg);
}
</style>
