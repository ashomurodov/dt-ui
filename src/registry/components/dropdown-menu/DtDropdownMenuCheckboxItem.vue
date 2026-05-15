<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
} from 'reka-ui'

const props = withDefaults(defineProps<{
  modelValue?: boolean | 'indeterminate'
  disabled?: boolean
  textValue?: string
}>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
  select: [event: Event]
}>()

const checked = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <DropdownMenuCheckboxItem
    v-model:checked="checked"
    class="dt-dropdown-checkbox-item"
    :disabled="disabled"
    :text-value="textValue"
    v-bind="$attrs"
    @select="emit('select', $event)"
  >
    <span class="dt-dropdown-checkbox-item__indicator" aria-hidden="true">
      <DropdownMenuItemIndicator>
        <svg v-if="modelValue === 'indeterminate'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </DropdownMenuItemIndicator>
    </span>
    <span class="dt-dropdown-checkbox-item__label">
      <slot />
    </span>
  </DropdownMenuCheckboxItem>
</template>

<style scoped>
.dt-dropdown-checkbox-item {
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

.dt-dropdown-checkbox-item[data-highlighted],
.dt-dropdown-checkbox-item:hover:not([data-disabled]) {
  background-color: var(--dt-gray-50);
}

.dt-dropdown-checkbox-item[data-disabled] {
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}

.dt-dropdown-checkbox-item__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--dt-color-accent);
}

.dt-dropdown-checkbox-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
