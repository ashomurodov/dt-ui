<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

const ctx = inject<{
  isOpen: Ref<boolean>
  search: Ref<string>
  close: () => void
  contentRef: Ref<HTMLElement | null>
}>('dt-select')!

const el = ref<HTMLElement | null>(null)

function onClickOutside(event: MouseEvent) {
  if (el.value && !el.value.contains(event.target as Node)) {
    // Check if click is on the trigger
    const trigger = el.value.closest('.dt-select')?.querySelector('.dt-select-trigger')
    if (trigger && trigger.contains(event.target as Node)) return
    ctx.close()
  }
}

watch(() => ctx.isOpen.value, (open) => {
  if (open) {
    setTimeout(() => {
      document.addEventListener('click', onClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', onClickOutside)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <Transition name="dt-select-content">
    <div
      v-if="ctx.isOpen.value"
      ref="el"
      class="dt-select-content"
      role="listbox"
      v-bind="$attrs"
    >
      <div v-if="$slots.search" class="dt-select-content__search">
        <slot name="search" />
      </div>
      <div class="dt-select-content__list">
        <slot />
      </div>
      <div v-if="$slots.empty" class="dt-select-content__empty">
        <slot name="empty" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dt-select-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: var(--dt-z-dropdown);
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-base);
  box-shadow: var(--dt-shadow-md);
  max-height: 15rem;
  overflow-y: auto;
  padding: var(--dt-space-1) 0;
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

/* Transition */
.dt-select-content-enter-active,
.dt-select-content-leave-active {
  transition: opacity var(--dt-transition-fast), transform var(--dt-transition-fast);
}

.dt-select-content-enter-from,
.dt-select-content-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
