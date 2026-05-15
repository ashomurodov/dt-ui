<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'

withDefaults(defineProps<{
  disabled?: boolean
  destructive?: boolean
  textValue?: string
}>(), {
  disabled: false,
  destructive: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

function onSelect(event: Event) {
  emit('select', event)
}
</script>

<template>
  <DropdownMenuItem
    class="dt-dropdown-item"
    :class="{ 'dt-dropdown-item--destructive': destructive }"
    :disabled="disabled"
    :text-value="textValue"
    v-bind="$attrs"
    @select="onSelect"
  >
    <span v-if="$slots.leading" class="dt-dropdown-item__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <span class="dt-dropdown-item__label">
      <slot />
    </span>
    <span v-if="$slots.trailing" class="dt-dropdown-item__trailing" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </DropdownMenuItem>
</template>

<style scoped>
.dt-dropdown-item {
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

.dt-dropdown-item[data-highlighted],
.dt-dropdown-item:hover:not([data-disabled]) {
  background-color: var(--dt-gray-50);
}

.dt-dropdown-item[data-disabled] {
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}

.dt-dropdown-item--destructive {
  color: var(--dt-color-error);
}

.dt-dropdown-item--destructive[data-highlighted],
.dt-dropdown-item--destructive:hover:not([data-disabled]) {
  background-color: var(--dt-error-50);
  color: var(--dt-color-error-hover);
}

.dt-dropdown-item__leading,
.dt-dropdown-item__trailing {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--dt-color-icon);
}

.dt-dropdown-item__leading :deep(svg),
.dt-dropdown-item__trailing :deep(svg) {
  width: 16px;
  height: 16px;
}

.dt-dropdown-item--destructive .dt-dropdown-item__leading,
.dt-dropdown-item--destructive .dt-dropdown-item__trailing {
  color: currentColor;
}

.dt-dropdown-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
