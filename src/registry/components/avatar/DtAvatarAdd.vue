<script setup lang="ts">
export type AvatarAddSize = 'xs' | 'sm' | 'md'

withDefaults(defineProps<{
  size?: AvatarAddSize
  disabled?: boolean
  ariaLabel?: string
}>(), {
  size: 'md',
  disabled: false,
  ariaLabel: 'Add',
})
</script>

<template>
  <button
    type="button"
    class="dt-avatar-add"
    :class="`dt-avatar-add--${size}`"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>
</template>

<style scoped>
.dt-avatar-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: var(--dt-radius-full);
  background: var(--dt-color-background);
  border: 1px dashed var(--dt-color-border-hover);
  color: var(--dt-color-text-tertiary);
  cursor: pointer;
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast),
    color var(--dt-transition-fast);
  flex-shrink: 0;
}

.dt-avatar-add:hover:not(:disabled) {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-text-tertiary);
  color: var(--dt-color-text);
}

.dt-avatar-add:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}

.dt-avatar-add:disabled {
  background: var(--dt-color-background-tertiary);
  border-color: var(--dt-color-border);
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}

/* Sizes */
.dt-avatar-add--xs { width: 24px; height: 24px; }
.dt-avatar-add--sm { width: 32px; height: 32px; }
.dt-avatar-add--md { width: 40px; height: 40px; }

.dt-avatar-add--xs svg { width: 12px; height: 12px; }
.dt-avatar-add--sm svg { width: 14px; height: 14px; }
.dt-avatar-add--md svg { width: 16px; height: 16px; }
</style>
