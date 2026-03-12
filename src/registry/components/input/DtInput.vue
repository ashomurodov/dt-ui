<script setup lang="ts">
import { computed, useAttrs } from 'vue'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: InputType
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  id?: string
}>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()

const inputId = computed(() => props.id || `dt-input-${Math.random().toString(36).slice(2, 9)}`)

const wrapperClasses = computed(() => [
  'dt-input-wrapper',
  props.error && 'dt-input-wrapper--error',
  props.disabled && 'dt-input-wrapper--disabled',
].filter(Boolean))

const inputClasses = computed(() => [
  'dt-input',
  props.error && 'dt-input--error',
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
  gap: var(--dt-space-1);
  width: 100%;
}

.dt-input__label {
  font-size: var(--dt-font-size-sm);
  font-weight: 500;
  color: var(--dt-foreground);
}

.dt-input {
  height: 2.5rem;
  width: 100%;
  padding: 0 0.75rem;
  font-size: var(--dt-font-size-base);
  font-family: inherit;
  color: var(--dt-foreground);
  background-color: var(--dt-background);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-md);
  transition: border-color var(--dt-transition-base),
    box-shadow var(--dt-transition-base);
  outline: none;
}

.dt-input::placeholder {
  color: var(--dt-muted-foreground);
}

.dt-input:hover:not(:disabled) {
  border-color: var(--dt-border-hover);
}

.dt-input:focus {
  border-color: var(--dt-ring);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dt-ring) 25%, transparent);
}

.dt-input--error {
  border-color: var(--dt-destructive);
}
.dt-input--error:focus {
  border-color: var(--dt-destructive);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dt-destructive) 25%, transparent);
}

.dt-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--dt-muted);
}

.dt-input__error {
  font-size: var(--dt-font-size-xs);
  color: var(--dt-destructive);
}

.dt-input__hint {
  font-size: var(--dt-font-size-xs);
  color: var(--dt-muted-foreground);
}

.dt-input-wrapper--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
