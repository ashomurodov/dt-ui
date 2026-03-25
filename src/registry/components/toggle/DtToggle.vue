<script setup lang="ts">
import { computed } from 'vue'

export type ToggleSize = 'lg' | 'md' | 'sm'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  size?: ToggleSize
  disabled?: boolean
}>(), {
  modelValue: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const classes = computed(() => [
  'dt-toggle',
  `dt-toggle--${props.size}`,
  props.modelValue && 'dt-toggle--active',
  props.disabled && 'dt-toggle--disabled',
].filter(Boolean))
</script>

<template>
  <button
    :class="classes"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="dt-toggle__thumb" />
  </button>
</template>

<style scoped>
.dt-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: var(--dt-radius-full);
  background: var(--dt-gray-200);
  cursor: pointer;
  padding: 2px;
  transition: background-color var(--dt-transition-base);
}

.dt-toggle:hover:not(:disabled) {
  background: var(--dt-gray-300);
}

.dt-toggle--active {
  background: var(--dt-color-accent);
}

.dt-toggle--active:hover:not(:disabled) {
  background: var(--dt-color-accent-hover);
}

.dt-toggle__thumb {
  display: block;
  background: #ffffff;
  border-radius: 50%;
  transition: transform var(--dt-transition-base);
}

/* Sizes */
.dt-toggle--lg {
  width: 44px;
  height: 24px;
}
.dt-toggle--lg .dt-toggle__thumb {
  width: 20px;
  height: 20px;
}
.dt-toggle--lg.dt-toggle--active .dt-toggle__thumb {
  transform: translateX(20px);
}

.dt-toggle--md {
  width: 36px;
  height: 20px;
}
.dt-toggle--md .dt-toggle__thumb {
  width: 16px;
  height: 16px;
}
.dt-toggle--md.dt-toggle--active .dt-toggle__thumb {
  transform: translateX(16px);
}

.dt-toggle--sm {
  width: 32px;
  height: 18px;
}
.dt-toggle--sm .dt-toggle__thumb {
  width: 14px;
  height: 14px;
}
.dt-toggle--sm.dt-toggle--active .dt-toggle__thumb {
  transform: translateX(14px);
}

/* Disabled */
.dt-toggle--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dt-toggle:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}
</style>
