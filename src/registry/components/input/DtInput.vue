<script setup lang="ts">
import { computed, useAttrs } from 'vue'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
export type InputSize = 'xl' | 'lg' | 'md' | 'sm'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: InputType
  size?: InputSize
  placeholder?: string
  disabled?: boolean
  error?: string
  success?: boolean
  hint?: string
  id?: string
}>(), {
  type: 'text',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()
const inputId = computed(() => props.id || `dt-input-${Math.random().toString(36).slice(2, 9)}`)

const wrapperClasses = computed(() => [
  'dt-input-wrapper',
  props.disabled && 'dt-input-wrapper--disabled',
].filter(Boolean))

const inputClasses = computed(() => [
  'dt-input',
  `dt-input--${props.size}`,
  props.error && 'dt-input--error',
  props.success && 'dt-input--success',
  props.modelValue && 'dt-input--filled',
].filter(Boolean))

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div :class="wrapperClasses">
    <label v-if="$slots.label" :for="inputId" class="dt-input__label">
      <slot name="label" />
    </label>
    <div class="dt-input__container">
      <span v-if="$slots['icon-left']" class="dt-input__icon dt-input__icon--left">
        <slot name="icon-left" />
      </span>
      <input
        :id="inputId"
        :class="inputClasses"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        v-bind="attrs"
        @input="onInput"
      />
      <span v-if="$slots['icon-right']" class="dt-input__icon dt-input__icon--right">
        <slot name="icon-right" />
      </span>
    </div>
    <p v-if="error" :id="`${inputId}-error`" class="dt-input__error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="dt-input__hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.dt-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-xs);
  width: 100%;
}

.dt-input__label {
  font-size: var(--dt-text-body-sm);
  font-weight: var(--dt-font-medium);
  color: var(--dt-color-text);
}

.dt-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.dt-input {
  width: 100%;
  font-family: inherit;
  color: var(--dt-gray-800);
  background: transparent;
  border: 1px solid var(--dt-color-border);
  outline: none;
  transition: border-color var(--dt-transition-base),
    background-color var(--dt-transition-base);
}

.dt-input::placeholder {
  color: var(--dt-gray-400);
}

/* Sizes */
.dt-input--xl {
  height: 64px;
  padding: 22px 24px;
  border-radius: var(--dt-radius-xl);
  font-size: var(--dt-text-body-md);
}
.dt-input--lg {
  height: 60px;
  padding: 22px 20px;
  border-radius: var(--dt-radius-xl);
  font-size: var(--dt-text-body-md);
}
.dt-input--md {
  height: 48px;
  padding: 16px 16px;
  border-radius: var(--dt-radius-lg);
  font-size: var(--dt-text-body-sm);
}
.dt-input--sm {
  height: 36px;
  padding: 12px 12px;
  border-radius: var(--dt-radius-md);
  font-size: var(--dt-text-body-xs);
}

/* States */
.dt-input--filled {
  background: var(--dt-gray-100);
}

.dt-input:hover:not(:disabled):not(:focus) {
  background: var(--dt-gray-100);
}

.dt-input:focus {
  background: var(--dt-color-background);
  border-color: var(--dt-color-ring);
}

.dt-input--error {
  border-color: var(--dt-color-error);
}
.dt-input--error:focus {
  border-color: var(--dt-color-error);
}

.dt-input--success {
  border-color: var(--dt-color-success);
}
.dt-input--success:focus {
  border-color: var(--dt-color-success);
}

.dt-input:disabled {
  background: var(--dt-gray-100);
  border-color: var(--dt-gray-100);
  color: var(--dt-color-disabled-text);
  cursor: not-allowed;
}

.dt-input:disabled::placeholder {
  color: var(--dt-color-disabled-text);
}

/* Icons */
.dt-input__icon {
  position: absolute;
  display: flex;
  align-items: center;
  color: var(--dt-color-icon);
  pointer-events: none;
}
.dt-input__icon--left {
  left: 16px;
}
.dt-input__icon--right {
  right: 16px;
}

.dt-input__container:has(.dt-input__icon--left) .dt-input {
  padding-left: 44px;
}
.dt-input__container:has(.dt-input__icon--right) .dt-input {
  padding-right: 44px;
}

/* Messages */
.dt-input__error {
  font-size: var(--dt-text-body-xs);
  color: var(--dt-color-error);
}

.dt-input__hint {
  font-size: var(--dt-text-body-xs);
  color: var(--dt-color-text-secondary);
}

.dt-input-wrapper--disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>
