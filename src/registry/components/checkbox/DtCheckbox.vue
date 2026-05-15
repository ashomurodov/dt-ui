<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'

export type CheckboxSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  /** Partially-checked state (visual only). Used for "select all" trees etc. */
  indeterminate?: boolean
  size?: CheckboxSize
  disabled?: boolean
  /** Inline label. Default slot wins if both are provided. */
  label?: string
  /** Secondary text rendered under the label. */
  description?: string
  id?: string
}>(), {
  modelValue: false,
  indeterminate: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id || `dt-checkbox-${Math.random().toString(36).slice(2, 9)}`)

// `indeterminate` is not a real HTML attribute — only a DOM property.
function syncIndeterminate() {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
}
onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)

function onChange(e: Event) {
  if (props.disabled) return
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

const classes = computed(() => [
  'dt-checkbox',
  `dt-checkbox--${props.size}`,
  props.modelValue && 'dt-checkbox--checked',
  props.indeterminate && 'dt-checkbox--indeterminate',
  props.disabled && 'dt-checkbox--disabled',
].filter(Boolean))
</script>

<template>
  <label :class="classes" :for="inputId">
    <input
      :id="inputId"
      ref="inputRef"
      type="checkbox"
      class="dt-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : modelValue"
      @change="onChange"
    />
    <span class="dt-checkbox__box">
      <svg
        v-if="indeterminate"
        class="dt-checkbox__glyph"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2.5 6h7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
      <svg
        v-else-if="modelValue"
        class="dt-checkbox__glyph"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <span v-if="$slots.default || label || description || $slots.description" class="dt-checkbox__text">
      <span class="dt-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description || $slots.description" class="dt-checkbox__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>

<style scoped>
.dt-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--dt-spacing-xl);
  cursor: pointer;
  user-select: none;
}

/* The native input is hidden but stays focusable — drives :focus-visible
   on the painted box via the adjacent sibling. */
.dt-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}

/* ── Box ─────────────────────────────────────── */
.dt-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--dt-color-background);
  border: 1.5px solid var(--dt-color-border-hover);
  border-radius: var(--dt-radius-xs);
  color: var(--dt-color-white);
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

/* Hover (unchecked): outline turns accent — only when not disabled */
.dt-checkbox:hover:not(.dt-checkbox--disabled) .dt-checkbox__box {
  border-color: var(--dt-color-accent-hover);
}

/* Focus-visible: outer 2px accent ring */
.dt-checkbox__input:focus-visible + .dt-checkbox__box::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 2px solid var(--dt-color-accent);
  border-radius: calc(var(--dt-radius-xs) + 2px);
  pointer-events: none;
}

/* ── Checked / Indeterminate ─────────────── */
.dt-checkbox--checked .dt-checkbox__box,
.dt-checkbox--indeterminate .dt-checkbox__box {
  background: var(--dt-color-accent);
  border-color: var(--dt-color-accent);
}

.dt-checkbox--checked:hover:not(.dt-checkbox--disabled) .dt-checkbox__box,
.dt-checkbox--indeterminate:hover:not(.dt-checkbox--disabled) .dt-checkbox__box {
  background: var(--dt-color-accent-hover);
  border-color: var(--dt-color-accent-hover);
}

/* ── Disabled ─────────────────────────────── */
.dt-checkbox--disabled {
  cursor: not-allowed;
}
.dt-checkbox--disabled .dt-checkbox__box {
  background: var(--dt-gray-200);
  border-color: var(--dt-color-border-hover);
}
.dt-checkbox--disabled.dt-checkbox--checked .dt-checkbox__box,
.dt-checkbox--disabled.dt-checkbox--indeterminate .dt-checkbox__box {
  background: var(--dt-brand-200);
  border-color: var(--dt-brand-200);
}

/* ── Sizes ────────────────────────────────── */
.dt-checkbox--sm .dt-checkbox__box   { width: 16px; height: 16px; }
.dt-checkbox--sm .dt-checkbox__glyph { width: 10px; height: 10px; }
.dt-checkbox--sm .dt-checkbox__label,
.dt-checkbox--sm .dt-checkbox__description {
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
}

.dt-checkbox--md .dt-checkbox__box   { width: 20px; height: 20px; }
.dt-checkbox--md .dt-checkbox__glyph { width: 12px; height: 12px; }
.dt-checkbox--md .dt-checkbox__label,
.dt-checkbox--md .dt-checkbox__description {
  font-size: var(--dt-text-body-md);
  line-height: var(--dt-leading-body-md);
}

.dt-checkbox--lg .dt-checkbox__box   { width: 24px; height: 24px; }
.dt-checkbox--lg .dt-checkbox__glyph { width: 14px; height: 14px; }
.dt-checkbox--lg .dt-checkbox__label,
.dt-checkbox--lg .dt-checkbox__description {
  font-size: 20px;
  line-height: 24px;
}

/* ── Text column ──────────────────────────── */
.dt-checkbox__text {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dt-checkbox__label {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-medium);
  color: var(--dt-gray-700);
}

.dt-checkbox__description {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-regular);
  color: var(--dt-gray-600);
}

.dt-checkbox--disabled .dt-checkbox__label,
.dt-checkbox--disabled .dt-checkbox__description {
  color: var(--dt-color-text-disabled);
}

/* When only a box is present (no text), the label gets vertical-center alignment. */
.dt-checkbox:not(:has(.dt-checkbox__text)) {
  align-items: center;
}
</style>
