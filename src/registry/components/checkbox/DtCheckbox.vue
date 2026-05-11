<script setup lang="ts">
import { computed } from 'vue'

export type CheckboxSize = 'lg' | 'md' | 'sm'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  size?: CheckboxSize
  disabled?: boolean
  id?: string
}>(), {
  modelValue: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputId = computed(() => props.id || `dt-checkbox-${Math.random().toString(36).slice(2, 9)}`)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const classes = computed(() => [
  'dt-checkbox',
  `dt-checkbox--${props.size}`,
  props.modelValue && 'dt-checkbox--checked',
  props.disabled && 'dt-checkbox--disabled',
].filter(Boolean))
</script>

<template>
  <label :class="classes" :for="inputId">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="dt-checkbox__input"
      @change="toggle"
    />
    <span class="dt-checkbox__box">
      <svg v-if="modelValue" class="dt-checkbox__check" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span v-if="$slots.default" class="dt-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<style scoped>
.dt-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-md);
  cursor: pointer;
  user-select: none;
}

.dt-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.dt-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-radius-xxs);
  background: var(--dt-gray-200);
  transition: background-color var(--dt-transition-base);
  flex-shrink: 0;
}

.dt-checkbox:hover:not(.dt-checkbox--disabled) .dt-checkbox__box {
  background: var(--dt-gray-300);
}

.dt-checkbox--checked .dt-checkbox__box {
  background: var(--dt-color-accent);
}

.dt-checkbox--checked:hover:not(.dt-checkbox--disabled) .dt-checkbox__box {
  background: var(--dt-color-accent-hover);
}

.dt-checkbox__check {
  color: var(--dt-color-white);
}

/* Sizes */
.dt-checkbox--lg .dt-checkbox__box {
  width: 24px;
  height: 24px;
}
.dt-checkbox--lg .dt-checkbox__check {
  width: 14px;
  height: 14px;
}

.dt-checkbox--md .dt-checkbox__box {
  width: 20px;
  height: 20px;
}
.dt-checkbox--md .dt-checkbox__check {
  width: 12px;
  height: 12px;
}

.dt-checkbox--sm .dt-checkbox__box {
  width: 16px;
  height: 16px;
}
.dt-checkbox--sm .dt-checkbox__check {
  width: 10px;
  height: 10px;
}

.dt-checkbox__label {
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text);
}

/* Disabled */
.dt-checkbox--disabled {
  cursor: not-allowed;
}
.dt-checkbox--disabled .dt-checkbox__box {
  background: var(--dt-gray-100);
}
.dt-checkbox--disabled .dt-checkbox__label {
  color: var(--dt-color-disabled-text);
}

/* Focus */
.dt-checkbox__input:focus-visible + .dt-checkbox__box {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}
</style>
