<script setup lang="ts">
import { DropdownMenuSubTrigger } from 'reka-ui'

withDefaults(defineProps<{
  disabled?: boolean
  textValue?: string
}>(), {
  disabled: false,
})
</script>

<template>
  <DropdownMenuSubTrigger
    class="dt-dropdown-sub-trigger"
    :disabled="disabled"
    :text-value="textValue"
    v-bind="$attrs"
  >
    <span v-if="$slots.leading" class="dt-dropdown-sub-trigger__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <span class="dt-dropdown-sub-trigger__label">
      <slot />
    </span>
    <span class="dt-dropdown-sub-trigger__chevron" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </DropdownMenuSubTrigger>
</template>

<style scoped>
.dt-dropdown-sub-trigger {
  display: flex;
  align-items: center;
  gap: var(--dt-spacing-md);
  margin: 1px var(--dt-spacing-sm);
  padding: var(--dt-spacing-md) var(--dt-spacing-sm) var(--dt-spacing-md) var(--dt-spacing-md);
  border-radius: var(--dt-radius-sm);
  font-family: var(--dt-font-family);
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
  font-weight: var(--dt-font-medium);
  color: var(--dt-gray-800);
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: background-color var(--dt-transition-fast);
}

.dt-dropdown-sub-trigger[data-highlighted],
.dt-dropdown-sub-trigger[data-state='open'],
.dt-dropdown-sub-trigger:hover:not([data-disabled]) {
  background-color: var(--dt-gray-50);
}

.dt-dropdown-sub-trigger[data-disabled] {
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}

.dt-dropdown-sub-trigger__leading {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--dt-color-icon);
}

.dt-dropdown-sub-trigger__leading :deep(svg) {
  width: 16px;
  height: 16px;
}

.dt-dropdown-sub-trigger__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dt-dropdown-sub-trigger__chevron {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--dt-color-icon-secondary);
}
</style>
