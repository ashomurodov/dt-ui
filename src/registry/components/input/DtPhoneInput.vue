<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import DtInput, { type InputVariant, type InputSize, type InputState, type InputLabelPosition } from './DtInput.vue'
import { countries, applyMask, maskDigitCount, type CountryDial } from './countries'

export interface PhoneValue {
  /** Full E.164-ish phone, e.g. `+998901234567` (no spaces/parens). */
  e164: string
  /** ISO code of the selected country, e.g. `'UZ'`. */
  country: CountryDial['code']
  /** Just the masked national portion, e.g. `'(90) 123 45 67'`. */
  national: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | PhoneValue
  defaultCountry?: CountryDial['code']
  variant?: InputVariant
  size?: InputSize
  label?: string
  labelPosition?: InputLabelPosition
  state?: InputState
  message?: string
  disabled?: boolean
  /** Limit the country dropdown. If omitted, uses the built-in 5-country list. */
  allowedCountries?: CountryDial['code'][]
}>(), {
  defaultCountry: 'UZ',
  variant: 'primary',
  size: 'md',
  labelPosition: 'top',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: PhoneValue]
}>()

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

const visibleCountries = computed(() =>
  props.allowedCountries
    ? countries.filter((c) => props.allowedCountries!.includes(c.code))
    : countries,
)

function isPhoneValue(v: unknown): v is PhoneValue {
  return typeof v === 'object' && v !== null && 'country' in v
}

// Resolve initial country from either a PhoneValue or the defaultCountry prop.
function initialCountry(): CountryDial {
  const mv = props.modelValue
  if (isPhoneValue(mv)) {
    const found = countries.find((c) => c.code === mv.country)
    if (found) return found
  }
  return countries.find((c) => c.code === props.defaultCountry) ?? countries[0]
}

const country = ref<CountryDial>(initialCountry())
const national = ref<string>('')

// Initialize national from prop if provided.
{
  const mv = props.modelValue
  if (isPhoneValue(mv) && mv.national) {
    national.value = applyMask(mv.national, country.value.mask)
  } else if (typeof mv === 'string' && mv) {
    // Parse a string E.164 form: strip dial code, treat rest as national digits.
    const stripped = mv.startsWith(country.value.dial)
      ? mv.slice(country.value.dial.length)
      : mv.replace(/^\+/, '')
    national.value = applyMask(stripped, country.value.mask)
  }
}

const dropdownOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)

function selectCountry(c: CountryDial) {
  // Keep digits-only across country changes; reapply the new mask.
  const digits = national.value.replace(/\D/g, '')
  country.value = c
  national.value = applyMask(digits.slice(0, maskDigitCount(c.mask)), c.mask)
  dropdownOpen.value = false
  triggerRef.value?.focus()
  emitValue()
}

function onNationalInput(value: string | number) {
  const str = String(value)
  national.value = applyMask(str, country.value.mask)
  emitValue()
}

function emitValue() {
  const digits = national.value.replace(/\D/g, '')
  emit('update:modelValue', {
    e164: digits ? `${country.value.dial}${digits}` : '',
    country: country.value.code,
    national: national.value,
  })
}

// Sync if the parent rewrites modelValue externally.
watch(() => props.modelValue, (next) => {
  if (isPhoneValue(next)) {
    const found = countries.find((c) => c.code === next.country)
    if (found && found.code !== country.value.code) {
      country.value = found
    }
    if (next.national != null) {
      national.value = applyMask(next.national, country.value.mask)
    }
  } else if (typeof next === 'string') {
    const stripped = next.startsWith(country.value.dial)
      ? next.slice(country.value.dial.length)
      : next.replace(/^\+/, '')
    national.value = applyMask(stripped, country.value.mask)
  }
})

const placeholder = computed(() => country.value.mask.replace(/0/g, '0'))

function toggleDropdown() {
  if (props.disabled) return
  dropdownOpen.value = !dropdownOpen.value
}

function onDocumentClick(e: MouseEvent) {
  if (!triggerRef.value) return
  const target = e.target as Node
  if (!triggerRef.value.parentElement?.contains(target)) {
    dropdownOpen.value = false
  }
}

watch(dropdownOpen, (open) => {
  if (open) {
    setTimeout(() => document.addEventListener('click', onDocumentClick), 0)
  } else {
    document.removeEventListener('click', onDocumentClick)
  }
})
</script>

<template>
  <DtInput
    :model-value="national"
    :variant="variant"
    :size="size"
    :label="label"
    :label-position="labelPosition"
    :state="state"
    :message="message"
    :placeholder="placeholder"
    :disabled="disabled"
    :compact-prefix="true"
    inputmode="tel"
    autocomplete="tel-national"
    v-bind="attrs"
    @update:model-value="onNationalInput"
  >
    <template #prefix>
      <div class="dt-phone-prefix" :class="`dt-phone-prefix--${size}`">
        <button
          ref="triggerRef"
          type="button"
          class="dt-phone-prefix__trigger"
          :disabled="disabled || visibleCountries.length <= 1"
          :aria-haspopup="visibleCountries.length > 1 ? 'listbox' : undefined"
          :aria-expanded="visibleCountries.length > 1 ? dropdownOpen : undefined"
          :aria-label="visibleCountries.length > 1 ? `Country: ${country.name}` : country.name"
          @click="toggleDropdown"
        >
          <span class="dt-phone-prefix__chip" aria-hidden="true" v-html="country.flag" />
        </button>
        <span class="dt-phone-prefix__dial">{{ country.dial }}</span>

        <ul
          v-if="dropdownOpen && visibleCountries.length > 1"
          class="dt-phone-prefix__menu"
          role="listbox"
        >
          <li
            v-for="c in visibleCountries"
            :key="c.code"
            class="dt-phone-prefix__option"
            :class="{ 'dt-phone-prefix__option--active': c.code === country.code }"
            role="option"
            :aria-selected="c.code === country.code"
            @click="selectCountry(c)"
          >
            <span class="dt-phone-prefix__option-flag" aria-hidden="true" v-html="c.flag" />
            <span class="dt-phone-prefix__option-name">{{ c.name }}</span>
            <span class="dt-phone-prefix__option-dial">{{ c.dial }}</span>
          </li>
        </ul>
      </div>
    </template>
  </DtInput>
</template>

<style scoped>
.dt-phone-prefix {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-sm);
}

/* Flag chip — clickable when there's a country dropdown. */
.dt-phone-prefix__trigger {
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: var(--dt-radius-md);
  flex-shrink: 0;
}

.dt-phone-prefix__trigger:disabled {
  cursor: default;
}

.dt-phone-prefix__trigger:focus-visible {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}

.dt-phone-prefix__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-background-tertiary);
  border-radius: var(--dt-radius-md);
  overflow: hidden;
  transition: background-color var(--dt-transition-fast);
}

.dt-phone-prefix__chip :deep(svg) {
  width: 44%;
  height: auto;
  display: block;
  border-radius: 2px;
}

.dt-phone-prefix__trigger:not(:disabled):hover .dt-phone-prefix__chip {
  background: var(--dt-gray-200);
}

/* Chip scales with the input size. */
.dt-phone-prefix--sm .dt-phone-prefix__chip { width: 36px; height: 36px; }
.dt-phone-prefix--md .dt-phone-prefix__chip { width: 44px; height: 44px; }
.dt-phone-prefix--lg .dt-phone-prefix__chip { width: 50px; height: 50px; }
.dt-phone-prefix--xl .dt-phone-prefix__chip { width: 56px; height: 56px; }

.dt-phone-prefix__option-flag {
  display: inline-flex;
  width: 24px;
  height: 18px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1);
}
.dt-phone-prefix__option-flag :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.dt-phone-prefix__dial {
  color: var(--dt-color-text);
}

.dt-phone-prefix__menu {
  position: absolute;
  top: calc(100% + var(--dt-spacing-md));
  left: 0;
  z-index: var(--dt-z-dropdown);
  min-width: 220px;
  margin: 0;
  padding: var(--dt-spacing-xs);
  list-style: none;
  background: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-md);
  box-shadow: var(--dt-shadow-lg);
}

.dt-phone-prefix__option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--dt-spacing-md);
  padding: var(--dt-spacing-md) var(--dt-spacing-lg);
  border-radius: var(--dt-radius-sm);
  cursor: pointer;
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text);
}

.dt-phone-prefix__option:hover {
  background: var(--dt-color-background-secondary);
}

.dt-phone-prefix__option--active {
  background: var(--dt-color-accent-light);
  color: var(--dt-color-accent);
}

.dt-phone-prefix__option-dial {
  color: var(--dt-color-text-secondary);
  font-variant-numeric: tabular-nums;
}
</style>
