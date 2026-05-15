<script setup lang="ts">
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
} from 'reka-ui'

withDefaults(defineProps<{
  value: string
  disabled?: boolean
  textValue?: string
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()
</script>

<template>
  <DropdownMenuRadioItem
    :value="value"
    :disabled="disabled"
    :text-value="textValue"
    class="dt-dropdown-radio-item"
    v-bind="$attrs"
    @select="emit('select', $event)"
  >
    <span class="dt-dropdown-radio-item__indicator" aria-hidden="true">
      <DropdownMenuItemIndicator>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="4" fill="currentColor" />
        </svg>
      </DropdownMenuItemIndicator>
    </span>
    <span class="dt-dropdown-radio-item__label">
      <slot />
    </span>
  </DropdownMenuRadioItem>
</template>

<style scoped>
.dt-dropdown-radio-item {
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

.dt-dropdown-radio-item[data-highlighted],
.dt-dropdown-radio-item:hover:not([data-disabled]) {
  background-color: var(--dt-gray-50);
}

.dt-dropdown-radio-item[data-disabled] {
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}

.dt-dropdown-radio-item__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--dt-color-accent);
}

.dt-dropdown-radio-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
