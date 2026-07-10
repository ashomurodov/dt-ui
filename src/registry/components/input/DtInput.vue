<script setup lang="ts">
import { computed, nextTick, ref, useAttrs } from 'vue'

export type InputSize = 'sm' | 'md' | 'lg' | 'xl'
export type InputState = 'error' | 'success' | undefined
export type InputLabelPosition = 'top' | 'floating'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  size?: InputSize
  label?: string
  labelPosition?: InputLabelPosition
  state?: InputState
  message?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  /** Reduce left padding so a chip-style prefix (e.g. phone flag) can sit close to the edge. */
  compactPrefix?: boolean
  id?: string
}>(), {
  type: 'text',
  size: 'md',
  labelPosition: 'top',
  disabled: false,
  clearable: false,
  compactPrefix: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  clear: []
}>()

// The root is a wrapper <div> while $attrs are bound to the inner <input>.
// See `rootAttrs`/`attrs` below.
defineOptions({ inheritAttrs: false })

defineExpose({ focus: () => inputRef.value?.focus() })

/**
 * Fallthrough attributes are split by where they belong.
 *
 * The root of this component is the wrapper `<div>`, but `$attrs` is bound to the
 * inner `<input>`. Without `inheritAttrs: false` (below), Vue ALSO auto-applies
 * every attribute to that wrapper — rendering
 * `<div class="dt-input-wrapper" min="0" aria-label="…">`. Field attributes on a
 * div are invalid, and a duplicated `aria-label` gives the wrapper an accessible
 * name it should not have.
 *
 * `class`/`style` are the exception: a caller sizes and positions the WRAPPER, so
 * those are re-applied there by hand.
 */
const rawAttrs = useAttrs()

const rootAttrs = computed(() => ({
  class: rawAttrs.class,
  style: rawAttrs.style,
}))

const attrs = computed(() => {
  const { class: _class, style: _style, ...fieldAttrs } = rawAttrs
  return fieldAttrs
})

const inputRef = ref<HTMLInputElement | null>(null)
const uid = Math.random().toString(36).slice(2, 9)
const inputId = computed(() => props.id || `dt-input-${uid}`)
const msgId = computed(() => `${inputId.value}-msg`)

const hasValue = computed(() => props.modelValue !== '' && props.modelValue != null)

// In floating mode the placeholder is suppressed visually but kept non-empty
// so the `:placeholder-shown` selector still works for the float animation.
const effectivePlaceholder = computed(() => {
  if (props.labelPosition === 'floating' && props.label) return ' '
  return props.placeholder
})

async function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' && target.value !== ''
    ? Number(target.value)
    : target.value
  emit('update:modelValue', value)

  // Re-sync the DOM after parent reactivity settles. Handles the case where
  // the parent masked/normalized the input back to the same value Vue was
  // already bound to (e.g. typing past a phone mask's digit limit) — without
  // this, Vue skips the re-render and the DOM keeps the overflowed text.
  await nextTick()
  const expected = props.modelValue == null ? '' : String(props.modelValue)
  if (target.value !== expected) {
    target.value = expected
  }
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}
</script>

<template>
  <div
    class="dt-input-wrapper"
    :class="[`dt-input-wrapper--${size}`, rootAttrs.class]"
    :style="rootAttrs.style"
  >
    <label
      v-if="label && labelPosition === 'top'"
      :for="inputId"
      class="dt-input__top-label"
    >
      {{ label }}
    </label>

    <label
      class="dt-input"
      :for="inputId"
      :class="[
        `dt-input--${size}`,
        labelPosition === 'floating' && label && 'dt-input--floating',
        state && `dt-input--${state}`,
        disabled && 'dt-input--disabled',
        hasValue && 'dt-input--has-value',
        compactPrefix && 'dt-input--compact-prefix',
      ]"
    >
      <span v-if="$slots.prefix" class="dt-input__adornment dt-input__adornment--start">
        <slot name="prefix" />
      </span>

      <div class="dt-input__field-wrap">
        <input
          :id="inputId"
          ref="inputRef"
          class="dt-input__field"
          :type="type"
          :value="modelValue"
          :placeholder="effectivePlaceholder"
          :disabled="disabled"
          :aria-invalid="state === 'error' ? 'true' : undefined"
          :aria-describedby="message ? msgId : undefined"
          v-bind="attrs"
          @input="onInput"
        />
        <label
          v-if="label && labelPosition === 'floating'"
          :for="inputId"
          class="dt-input__floating-label"
        >
          {{ label }}
        </label>
      </div>

      <button
        v-if="clearable && hasValue && !disabled"
        type="button"
        class="dt-input__clear"
        aria-label="Clear"
        @click="onClear"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <span v-if="$slots.suffix" class="dt-input__adornment dt-input__adornment--end">
        <slot name="suffix" />
      </span>
    </label>

    <p
      v-if="message"
      :id="msgId"
      class="dt-input__message"
      :class="state && `dt-input__message--${state}`"
      :role="state === 'error' ? 'alert' : undefined"
    >
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.dt-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-md);
  width: 100%;
}

.dt-input__top-label {
  font-size: var(--dt-text-body-sm);
  font-weight: var(--dt-font-medium);
  color: var(--dt-color-text);
  line-height: var(--dt-leading-body-sm);
}

/* ── Container ─────────────────────────────────
   One visual treatment, four states:
   default → white bg
   hover / focus / disabled → tinted bg (background-tertiary = #f8f9fa)
   focus → accent border, no glow ring
*/
.dt-input {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  background: var(--dt-color-background);
  border: 1.5px solid var(--dt-color-border);
  transition: border-color var(--dt-transition-fast),
    background-color var(--dt-transition-fast);
  cursor: text;
}

/* Bg changes on hover/focus for ALL states (incl. error/success). */
.dt-input:hover:not(.dt-input--disabled):not(:focus-within) {
  background: var(--dt-color-background-tertiary); /* gray-100 */
}

.dt-input:focus-within:not(.dt-input--disabled) {
  background: var(--dt-gray-50); /* lighter than hover */
}

/* Border color flips to accent on focus only when no validation state is set —
   error/success keep their validation border in every interactive state. */
.dt-input:focus-within:not(.dt-input--disabled):not(.dt-input--error):not(.dt-input--success) {
  border-color: var(--dt-color-accent);
}

/* ── Sizes ─────────────────────────────────── */
.dt-input--sm {
  min-height: 48px;
  padding: 0 var(--dt-spacing-2xl);
  border-radius: var(--dt-radius-md);
  font-size: var(--dt-text-body-sm);
}
.dt-input--md {
  min-height: 56px;
  padding: 0 var(--dt-spacing-3xl);
  border-radius: var(--dt-radius-lg);
  font-size: var(--dt-text-body-md);
}
.dt-input--lg {
  min-height: 64px;
  padding: 0 var(--dt-spacing-4xl);
  border-radius: var(--dt-radius-xl);
  font-size: var(--dt-text-body-md);
  border-width: 2px;
}
.dt-input--xl {
  min-height: 72px;
  padding: 0 var(--dt-spacing-4xl);
  border-radius: var(--dt-radius-xl);
  font-size: 18px;
  border-width: 2px;
}

/* Compact-prefix mode: shrink the left padding so a chip prefix sits close to the edge. */
.dt-input--compact-prefix { padding-left: var(--dt-spacing-sm); }
.dt-input--compact-prefix .dt-input__adornment--start { margin-right: var(--dt-spacing-md); }

/* ── Native input ──────────────────────────── */
.dt-input__field-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  align-self: stretch;
}

.dt-input__field {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  outline: none;
  font: inherit;
  color: var(--dt-color-text);
  padding: 0;
  line-height: 1.25;
}

.dt-input__field::placeholder {
  color: var(--dt-color-text-tertiary);
}

/* Suppress placeholder text in floating-label mode (the floating label
   replaces it visually; the literal " " placeholder is only kept so the
   :placeholder-shown selector keeps working). */
.dt-input--floating .dt-input__field::placeholder {
  color: transparent;
}

/* ── Floating label — stays INSIDE the field ── */
.dt-input--floating .dt-input__field {
  /* Leave room for the label at the top, value slightly below center. */
  padding-top: 20px;
  padding-bottom: 0;
}

.dt-input__floating-label {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--dt-color-text-tertiary);
  font-size: inherit;
  line-height: 1;
  transition: top 140ms ease, font-size 140ms ease, transform 140ms ease;
}

/* When focused or filled: label moves to TOP of the field (still inside) */
.dt-input__field:focus ~ .dt-input__floating-label,
.dt-input__field:not(:placeholder-shown) ~ .dt-input__floating-label {
  top: 8px;
  transform: translateY(0);
  font-size: var(--dt-text-body-xs);
  /* Color stays secondary in all states — the field border carries the focus signal */
  color: var(--dt-color-text-secondary);
}

/* ── Adornments / clear ────────────────────── */
.dt-input__adornment {
  display: inline-flex;
  align-items: center;
  color: var(--dt-color-text-secondary);
  flex-shrink: 0;
}
.dt-input__adornment--start { margin-right: var(--dt-spacing-md); }
.dt-input__adornment--end   { margin-left:  var(--dt-spacing-md); }

.dt-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: var(--dt-spacing-md);
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: var(--dt-radius-full);
  color: var(--dt-color-text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color var(--dt-transition-fast), color var(--dt-transition-fast);
}
.dt-input__clear:hover {
  background: var(--dt-color-background-tertiary);
  color: var(--dt-color-text);
}
.dt-input__clear:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}
.dt-input__clear svg {
  width: 12px;
  height: 12px;
}

/* ── Validation states ────────────────────── */
.dt-input--error           { border-color: var(--dt-color-error); }
.dt-input--error:focus-within { border-color: var(--dt-color-error); }

.dt-input--success            { border-color: var(--dt-color-success); }
.dt-input--success:focus-within { border-color: var(--dt-color-success); }

/* ── Disabled ──────────────────────────────── */
.dt-input--disabled {
  background: var(--dt-color-background-tertiary);
  border-color: var(--dt-color-border);
  cursor: not-allowed;
}
.dt-input--disabled .dt-input__field {
  color: var(--dt-color-text-disabled);
  cursor: not-allowed;
}
.dt-input--disabled .dt-input__field::placeholder,
.dt-input--disabled .dt-input__floating-label {
  color: var(--dt-color-text-disabled);
}

/* ── Message line ──────────────────────────── */
.dt-input__message {
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
  color: var(--dt-color-text-secondary);
  margin: 0;
}
.dt-input__message--error   { color: var(--dt-color-error); }
.dt-input__message--success { color: var(--dt-color-success); }
</style>
