<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from 'reka-ui'
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="dt-dialog-overlay" />
    <DialogContent class="dt-dialog-content" v-bind="$attrs">
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<style scoped>
.dt-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--dt-z-overlay);
  background-color: var(--dt-color-overlay);
}

.dt-dialog-overlay[data-state='open'] {
  animation: dt-dialog-overlay-in var(--dt-transition-base);
}

.dt-dialog-overlay[data-state='closed'] {
  animation: dt-dialog-overlay-out var(--dt-transition-base);
}

.dt-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: var(--dt-z-modal);
  width: calc(100% - (var(--dt-space-4) * 2));
  max-width: 28rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background-color: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-lg);
  box-shadow: var(--dt-shadow-lg);
  padding: var(--dt-space-6);
  transform: translate(-50%, -50%);
  outline: none;
}

.dt-dialog-content[data-state='open'] {
  animation: dt-dialog-content-in var(--dt-transition-base);
}

.dt-dialog-content[data-state='closed'] {
  animation: dt-dialog-content-out var(--dt-transition-base);
}

@keyframes dt-dialog-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dt-dialog-overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dt-dialog-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 0.5rem)) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dt-dialog-content-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 0.5rem)) scale(0.95);
  }
}
</style>
