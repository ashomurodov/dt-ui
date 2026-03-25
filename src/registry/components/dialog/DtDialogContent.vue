<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount, nextTick, type Ref, type ComputedRef } from 'vue'

const dialog = inject<{
  isOpen: ComputedRef<boolean>
  close: () => void
}>('dt-dialog')!

const contentRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const animating = ref(false)

// Focus trap
const previousActiveElement = ref<HTMLElement | null>(null)

function focusTrap(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !contentRef.value) return

  const focusableElements = contentRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  if (focusableElements.length === 0) return

  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    dialog.close()
  }
  focusTrap(event)
}

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    dialog.close()
  }
}

watch(() => dialog.isOpen.value, async (open) => {
  if (open) {
    previousActiveElement.value = document.activeElement as HTMLElement
    visible.value = true
    document.body.style.overflow = 'hidden'
    await nextTick()
    animating.value = true
    // Focus the first focusable element
    const firstFocusable = contentRef.value?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  } else {
    animating.value = false
    document.body.style.overflow = ''
    // Wait for exit animation
    setTimeout(() => {
      visible.value = false
      previousActiveElement.value?.focus()
    }, 200)
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="dt-dialog-overlay"
      :class="{ 'dt-dialog-overlay--open': animating }"
      @click="onOverlayClick"
      @keydown="onKeydown"
    >
      <div
        ref="contentRef"
        class="dt-dialog-content"
        :class="{ 'dt-dialog-content--open': animating }"
        role="dialog"
        aria-modal="true"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dt-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--dt-z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-4);
  background-color: var(--dt-color-overlay);
  opacity: 0;
  transition: opacity var(--dt-transition-base);
}

.dt-dialog-overlay--open {
  opacity: 1;
}

.dt-dialog-content {
  position: relative;
  z-index: var(--dt-z-modal);
  width: 100%;
  max-width: 28rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-lg);
  box-shadow: var(--dt-shadow-lg);
  padding: var(--dt-space-6);
  transform: scale(0.95) translateY(0.5rem);
  opacity: 0;
  transition: transform var(--dt-transition-base), opacity var(--dt-transition-base);
}

.dt-dialog-content--open {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>
