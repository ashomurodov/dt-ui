<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'

export type DropdownTriggerSize = 'sm' | 'md' | 'lg'

withDefaults(defineProps<{
  asChild?: boolean
  iconOnly?: boolean
  size?: DropdownTriggerSize
  disabled?: boolean
  label?: string
}>(), {
  asChild: false,
  iconOnly: false,
  size: 'md',
})
</script>

<template>
  <DropdownMenuTrigger
    v-if="asChild"
    as-child
    v-bind="$attrs"
  >
    <slot />
  </DropdownMenuTrigger>

  <DropdownMenuTrigger
    v-else
    class="dt-dropdown-trigger"
    :class="[
      `dt-dropdown-trigger--${size}`,
      iconOnly && 'dt-dropdown-trigger--icon',
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template v-if="iconOnly">
      <span class="dt-dropdown-trigger__icon" aria-hidden="true">
        <slot>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
          </svg>
        </slot>
      </span>
    </template>
    <template v-else>
      <span v-if="$slots.leading" class="dt-dropdown-trigger__icon" aria-hidden="true">
        <slot name="leading" />
      </span>
      <span class="dt-dropdown-trigger__label">
        <slot>{{ label }}</slot>
      </span>
      <span class="dt-dropdown-trigger__chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </template>
  </DropdownMenuTrigger>
</template>

<style scoped>
.dt-dropdown-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-spacing-md);
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-medium);
  color: var(--dt-gray-800);
  background: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-sm);
  box-shadow: var(--dt-shadow-xs);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast),
    color var(--dt-transition-fast);
}

.dt-dropdown-trigger:hover:not(:disabled) {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-border-hover);
}

.dt-dropdown-trigger[data-state='open'] {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-border-hover);
}

.dt-dropdown-trigger:disabled {
  background: var(--dt-color-disabled-bg);
  border-color: var(--dt-color-disabled-bg);
  color: var(--dt-color-disabled-text);
  cursor: not-allowed;
  box-shadow: none;
}

/* Focus ring */
.dt-dropdown-trigger:focus-visible {
  outline: none;
}
.dt-dropdown-trigger:focus-visible::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 2px solid var(--dt-color-accent);
  border-radius: calc(var(--dt-radius-sm) + 4px);
  pointer-events: none;
}

/* ── Sizes ───────────────────────────────────── */
.dt-dropdown-trigger--sm {
  height: 32px;
  padding: 0 var(--dt-spacing-lg);
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-dropdown-trigger--md {
  height: 36px;
  padding: 0 var(--dt-spacing-lg);
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}
.dt-dropdown-trigger--lg {
  height: 40px;
  padding: 0 var(--dt-spacing-xl);
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}

/* ── Icon-only variant ───────────────────────── */
.dt-dropdown-trigger--icon {
  padding: 0;
  gap: 0;
}
.dt-dropdown-trigger--icon.dt-dropdown-trigger--sm {
  width: 24px;
  height: 24px;
  border-radius: var(--dt-radius-xs);
}
.dt-dropdown-trigger--icon.dt-dropdown-trigger--sm:focus-visible::after {
  border-radius: calc(var(--dt-radius-xs) + 4px);
}
.dt-dropdown-trigger--icon.dt-dropdown-trigger--md {
  width: 32px;
  height: 32px;
}
.dt-dropdown-trigger--icon.dt-dropdown-trigger--lg {
  width: 40px;
  height: 40px;
  border-radius: var(--dt-radius-md);
}
.dt-dropdown-trigger--icon.dt-dropdown-trigger--lg:focus-visible::after {
  border-radius: calc(var(--dt-radius-md) + 4px);
}

/* ── Parts ───────────────────────────────────── */
.dt-dropdown-trigger__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--dt-color-icon);
}
.dt-dropdown-trigger__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.dt-dropdown-trigger__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-dropdown-trigger__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--dt-color-icon-secondary);
  transition: transform var(--dt-transition-base);
}
.dt-dropdown-trigger[data-state='open'] .dt-dropdown-trigger__chevron {
  transform: rotate(180deg);
}
</style>
