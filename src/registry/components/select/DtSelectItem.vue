<script setup lang="ts">
import { inject, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

const props = withDefaults(defineProps<{
  value: string | number
  label?: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const ctx = inject<{
  selectedValue: ComputedRef<string | number | null>
  highlightedIndex: Ref<number>
  filteredItems: ComputedRef<Array<{ value: string | number; label: string; disabled?: boolean }>>
  select: (value: string | number) => void
  registerItem: (item: { value: string | number; label: string; disabled?: boolean }) => void
  unregisterItem: (value: string | number) => void
}>('dt-select')!

const isSelected = computed(() => ctx.selectedValue.value === props.value)

const itemIndex = computed(() =>
  ctx.filteredItems.value.findIndex(i => i.value === props.value)
)

const isHighlighted = computed(() =>
  ctx.highlightedIndex.value === itemIndex.value
)

const isVisible = computed(() =>
  ctx.filteredItems.value.some(i => i.value === props.value)
)

onMounted(() => {
  ctx.registerItem({
    value: props.value,
    label: props.label || String(props.value),
    disabled: props.disabled,
  })
})

onBeforeUnmount(() => {
  ctx.unregisterItem(props.value)
})

function onClick() {
  if (!props.disabled) {
    ctx.select(props.value)
  }
}
</script>

<template>
  <div
    v-if="isVisible"
    class="dt-select-item"
    :class="{
      'dt-select-item--selected': isSelected,
      'dt-select-item--highlighted': isHighlighted,
      'dt-select-item--disabled': disabled,
    }"
    role="option"
    :aria-selected="isSelected"
    :aria-disabled="disabled"
    @click="onClick"
    @mouseenter="ctx.highlightedIndex.value = itemIndex"
    v-bind="$attrs"
  >
    <span class="dt-select-item__check" aria-hidden="true">
      <svg v-if="isSelected" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="dt-select-item__label">
      <slot>{{ label || value }}</slot>
    </span>
  </div>
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
.dt-select-item--highlighted {
  background-color: var(--dt-color-surface-hover);
}

.dt-select-item--selected {
  font-weight: 500;
}

.dt-select-item--disabled {
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
