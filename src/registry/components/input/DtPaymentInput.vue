<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import DtInput, { type InputVariant, type InputSize, type InputState, type InputLabelPosition } from './DtInput.vue'
import { detectCardBrand, formatCardNumber, type CardBrand } from './card-brands'

const props = withDefaults(defineProps<{
  /** Formatted card number (with spaces). */
  modelValue?: string
  variant?: InputVariant
  size?: InputSize
  label?: string
  labelPosition?: InputLabelPosition
  state?: InputState
  message?: string
  disabled?: boolean
  /** Max digits accepted. Defaults to 16 (Visa / MC / UzCard / Humo). Use 15 for Amex. */
  maxDigits?: number
}>(), {
  variant: 'primary',
  size: 'md',
  labelPosition: 'top',
  disabled: false,
  maxDigits: 16,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** Fires whenever the detected brand changes. */
  'brand-change': [brand: CardBrand]
}>()

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

const brand = computed<CardBrand>(() => detectCardBrand(String(props.modelValue ?? '')))

let lastBrand: CardBrand = brand.value
function onInput(value: string | number) {
  const formatted = formatCardNumber(String(value), props.maxDigits)
  emit('update:modelValue', formatted)
  const next = detectCardBrand(formatted)
  if (next !== lastBrand) {
    lastBrand = next
    emit('brand-change', next)
  }
}

defineExpose({ brand })
</script>

<template>
  <DtInput
    :model-value="modelValue"
    :variant="variant"
    :size="size"
    :label="label"
    :label-position="labelPosition"
    :state="state"
    :message="message"
    :disabled="disabled"
    placeholder="0000 0000 0000 0000"
    inputmode="numeric"
    autocomplete="cc-number"
    v-bind="attrs"
    @update:model-value="onInput"
  >
    <template v-if="$slots.brand" #suffix>
      <span class="dt-payment__brand">
        <slot name="brand" :brand="brand" />
      </span>
    </template>
  </DtInput>
</template>

<style scoped>
.dt-payment__brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
}
.dt-payment__brand :deep(svg),
.dt-payment__brand :deep(img) {
  max-height: 100%;
  width: auto;
}
</style>
