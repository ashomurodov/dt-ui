<script setup lang="ts">
import { computed } from 'vue'

export type RadioSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  value: string | number
  size?: RadioSize
  disabled?: boolean
  name?: string
  /** Inline label. Default slot wins if both are provided. */
  label?: string
  /** Secondary text rendered under the label. */
  description?: string
  id?: string
}>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => props.id || `dt-radio-${Math.random().toString(36).slice(2, 9)}`)
const isSelected = computed(() => props.modelValue === props.value)

function onChange() {
  if (!props.disabled) emit('update:modelValue', props.value)
}

const classes = computed(() => [
  'dt-radio',
  `dt-radio--${props.size}`,
  isSelected.value && 'dt-radio--selected',
  props.disabled && 'dt-radio--disabled',
].filter(Boolean))
</script>

<template>
  <label :class="classes" :for="inputId">
    <input
      :id="inputId"
      type="radio"
      class="dt-radio__input"
      :name="name"
      :value="value"
      :checked="isSelected"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="dt-radio__circle">
      <span v-if="isSelected" class="dt-radio__dot" />
    </span>

    <span v-if="$slots.default || label || description || $slots.description" class="dt-radio__text">
      <span class="dt-radio__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description || $slots.description" class="dt-radio__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>

<style scoped>
.dt-radio {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--dt-spacing-xl);
  cursor: pointer;
  user-select: none;
}

.dt-radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}

/* ── Circle ──────────────────────────────────── */
.dt-radio__circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--dt-color-background);
  border: 1.5px solid var(--dt-color-border-hover);
  border-radius: var(--dt-radius-full);
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

/* Hover (unselected): outline → accent */
.dt-radio:hover:not(.dt-radio--disabled) .dt-radio__circle {
  border-color: var(--dt-color-accent-hover);
}

/* Focus-visible: outer 2px accent ring */
.dt-radio__input:focus-visible + .dt-radio__circle::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 2px solid var(--dt-color-accent);
  border-radius: var(--dt-radius-full);
  pointer-events: none;
}

/* ── Selected ────────────────────────────────── */
.dt-radio--selected .dt-radio__circle {
  background: var(--dt-color-accent);
  border-color: var(--dt-color-accent);
}
.dt-radio--selected:hover:not(.dt-radio--disabled) .dt-radio__circle {
  background: var(--dt-color-accent-hover);
  border-color: var(--dt-color-accent-hover);
}

.dt-radio__dot {
  background: var(--dt-color-white);
  border-radius: var(--dt-radius-full);
  animation: dt-radio-pop 0.2s ease;
}

/* ── Disabled ────────────────────────────────── */
.dt-radio--disabled {
  cursor: not-allowed;
}
.dt-radio--disabled .dt-radio__circle {
  background: var(--dt-gray-200);
  border-color: var(--dt-color-border-hover);
}
.dt-radio--disabled.dt-radio--selected .dt-radio__circle {
  background: var(--dt-brand-200);
  border-color: var(--dt-brand-200);
}

/* ── Sizes ───────────────────────────────────── */
.dt-radio--sm .dt-radio__circle { width: 16px; height: 16px; }
.dt-radio--sm .dt-radio__dot    { width:  8px; height:  8px; }
.dt-radio--sm .dt-radio__label,
.dt-radio--sm .dt-radio__description {
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}

.dt-radio--md .dt-radio__circle { width: 20px; height: 20px; }
.dt-radio--md .dt-radio__dot    { width: 10px; height: 10px; }
.dt-radio--md .dt-radio__label,
.dt-radio--md .dt-radio__description {
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}

.dt-radio--lg .dt-radio__circle { width: 24px; height: 24px; }
.dt-radio--lg .dt-radio__dot    { width: 12px; height: 12px; }
.dt-radio--lg .dt-radio__label,
.dt-radio--lg .dt-radio__description {
  font-size: 20px;
  line-height: 24px;
}

/* ── Text column ─────────────────────────────── */
.dt-radio__text {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dt-radio__label {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-medium);
  color: var(--dt-gray-700);
}

.dt-radio__description {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-regular);
  color: var(--dt-gray-600);
}

.dt-radio--disabled .dt-radio__label,
.dt-radio--disabled .dt-radio__description {
  color: var(--dt-color-text-disabled);
}

/* When no text, vertically center the circle row */
.dt-radio:not(:has(.dt-radio__text)) {
  align-items: center;
}

@keyframes dt-radio-pop {
  0%   { transform: scale(0); }
  60%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
