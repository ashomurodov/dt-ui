<script setup lang="ts">
import { inject, type Ref, type ComputedRef } from 'vue'

const ctx = inject<{
  isOpen: Ref<boolean>
  selectedValue: ComputedRef<string | number | null>
  toggle: () => void
  triggerRef: Ref<HTMLElement | null>
  filteredItems: ComputedRef<Array<{ value: string | number; label: string }>>
  highlightedIndex: Ref<number>
  select: (value: string | number) => void
  close: () => void
}>('dt-select')!

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (ctx.isOpen.value && ctx.highlightedIndex.value >= 0) {
        const item = ctx.filteredItems.value[ctx.highlightedIndex.value]
        if (item) ctx.select(item.value)
      } else {
        ctx.toggle()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!ctx.isOpen.value) {
        ctx.toggle()
      } else {
        ctx.highlightedIndex.value = Math.min(
          ctx.highlightedIndex.value + 1,
          ctx.filteredItems.value.length - 1
        )
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (ctx.isOpen.value) {
        ctx.highlightedIndex.value = Math.max(ctx.highlightedIndex.value - 1, 0)
      }
      break
    case 'Escape':
      event.preventDefault()
      ctx.close()
      break
  }
}
</script>

<template>
  <button
    ref="el => ctx.triggerRef.value = el as HTMLElement"
    class="dt-select-trigger"
    :class="{ 'dt-select-trigger--open': ctx.isOpen.value }"
    type="button"
    role="combobox"
    :aria-expanded="ctx.isOpen.value"
    aria-haspopup="listbox"
    @click="ctx.toggle()"
    @keydown="onKeydown"
    v-bind="$attrs"
  >
    <span class="dt-select-trigger__value">
      <slot />
    </span>
    <span class="dt-select-trigger__icon" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
</template>

<style scoped>
.dt-select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: var(--dt-font-size-base);
  font-family: inherit;
  color: var(--dt-foreground);
  background-color: var(--dt-background);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-md);
  cursor: pointer;
  transition: border-color var(--dt-transition-base),
    box-shadow var(--dt-transition-base);
  outline: none;
  text-align: left;
}

.dt-select-trigger:hover {
  border-color: var(--dt-border-hover);
}

.dt-select-trigger:focus-visible {
  border-color: var(--dt-ring);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dt-ring) 25%, transparent);
}

.dt-select-trigger--open {
  border-color: var(--dt-ring);
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
  margin-left: var(--dt-space-2);
  color: var(--dt-muted-foreground);
  transition: transform var(--dt-transition-base);
}

.dt-select-trigger--open .dt-select-trigger__icon {
  transform: rotate(180deg);
}
</style>
