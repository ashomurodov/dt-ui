# DtInput

Text input with two visual variants, four sizes, validation states (error / success), top or floating label, optional clear button, and `prefix` / `suffix` slots for icons and adornments. Wraps a native `<input>`.

## Where fallthrough attributes land

`DtInput`'s root is a wrapper `<div>`, so it sets `inheritAttrs: false` and routes
attributes deliberately:

- **`class` and `style` → the wrapper.** That's what a caller sizes and positions.
- **Everything else → the inner `<input>`**: `min`, `max`, `step`, `autofocus`,
  `aria-*`, `data-*`, native listeners.

Before v0.1.92 the component had no `inheritAttrs: false`, so Vue *also* applied
every attribute to the wrapper — rendering
`<div class="dt-input-wrapper" min="0" aria-label="…">`. Field attributes on a
`<div>` are invalid, and the duplicated `aria-label` gave the wrapper an accessible
name it should not have.

⚠ Sizes start at **48px** (`sm`) and go to 72px (`xl`). This is a form field, not a
toolbar control — for dense 30px rows, use a plain `<input>`.

The same package ships:

- **`DtInput`** — the base component.
- **`DtPhoneInput`** — country flag + dial code + masked national number (UZ default, RU/KZ/KG/TJ also built-in).
- **`DtPaymentInput`** — card-number input with 4-digit grouping and built-in brand detection (Visa / Mastercard / Amex / UzCard / Humo).

## Import

```ts
import {
  DtInput,
  DtPhoneInput,
  DtPaymentInput,
  type PhoneValue,
  type CardBrand,
} from '@/components/ui/input'
```

## DtInput props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string \| number` | — | Bound value (v-model). |
| `type` | `string` | `'text'` | Native input type (text/email/password/number/search/tel/url/…). |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Primary = white background with border. Secondary = filled, borderless until focus. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Height: 48 / 56 / 64 / 72 px. |
| `label` | `string` | — | Label text. String-only — for custom markup, wrap externally. |
| `labelPosition` | `'top' \| 'floating'` | `'top'` | `top` = external label above the field. `floating` = label sits inside, animates up on focus or when filled. |
| `state` | `'error' \| 'success' \| undefined` | `undefined` | Validation state. Drives border color and message color. |
| `message` | `string` | — | Helper / error / success message rendered below the field. |
| `placeholder` | `string` | — | Native placeholder. Ignored visually when `labelPosition="floating"`. |
| `disabled` | `boolean` | `false` | Native disabled. |
| `clearable` | `boolean` | `false` | Shows a × button when the field has a value. Emits `clear` and clears `modelValue`. |
| `id` | `string` | auto | HTML id for `<label for>` association. |

## DtInput events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string \| number` | Standard v-model. |
| `clear` | — | Fires when the × button is clicked. |

## DtInput slots

| Slot | Description |
| ------ | ------------- |
| `prefix` | Leading adornment (icon, currency symbol, country flag, etc.). |
| `suffix` | Trailing adornment (icon, unit, brand logo, etc.). |

## Usage

### Basic

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtInput } from '@/components/ui/input'

const name = ref('')
</script>

<template>
  <DtInput v-model="name" label="Full name" placeholder="Your name" />
</template>
```

### Variants and sizes

```vue
<DtInput v-model="text" variant="primary"   label="Primary" />
<DtInput v-model="text" variant="secondary" label="Secondary" />

<DtInput v-model="text" size="sm" label="Small (48px)" />
<DtInput v-model="text" size="md" label="Medium (56px)" />
<DtInput v-model="text" size="lg" label="Large (64px)" />
<DtInput v-model="text" size="xl" label="Extra Large (72px)" />
```

### Floating label

```vue
<DtInput
  v-model="email"
  label="Email"
  label-position="floating"
  type="email"
/>
```

CSS-only animation driven by `:placeholder-shown` + `:focus`. No JS, no flicker.

### Validation

```vue
<DtInput v-model="email" label="Email"
         state="error"
         message="That doesn't look like a valid email" />

<DtInput v-model="email" label="Email"
         state="success"
         message="Looks good" />

<DtInput v-model="email" label="Hint"
         message="At least 3 characters" />
```

`state` drives border and message color. `message` works in all three modes (hint / error / success).

### Adornments

```vue
<DtInput v-model="search" label="Search" clearable>
  <template #prefix>
    <SearchIcon :size="18" />
  </template>
</DtInput>

<DtInput v-model="text" label="Website">
  <template #prefix><span>https://</span></template>
  <template #suffix><span>.com</span></template>
</DtInput>
```

## DtPhoneInput

Composes `DtInput` with a country prefix dropdown and per-country mask.

### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `PhoneValue \| string` | — | `{ e164, country, national }` object or a raw E.164 string. Emits a `PhoneValue`. |
| `defaultCountry` | `'UZ' \| 'RU' \| 'KZ' \| 'KG' \| 'TJ'` | `'UZ'` | Initial selected country. |
| `allowedCountries` | `Array<…>` | all 5 | Restricts the dropdown. Pass `['UZ']` to lock the prefix entirely. |
| ... | | | All other `DtInput` props are forwarded (`variant`, `size`, `label`, `labelPosition`, `state`, `message`, `disabled`). |

### `PhoneValue`

```ts
interface PhoneValue {
  /** Full international number, e.g. '+998901234567' (no spaces/parens). */
  e164: string
  /** ISO code of the selected country. */
  country: 'UZ' | 'RU' | 'KZ' | 'KG' | 'TJ'
  /** Masked national portion, e.g. '(90) 123 45 67'. */
  national: string
}
```

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtPhoneInput, type PhoneValue } from '@/components/ui/input'

const phone = ref<PhoneValue>({ e164: '', country: 'UZ', national: '' })
</script>

<template>
  <DtPhoneInput v-model="phone" label="Phone number" />
</template>
```

When the user picks a different country the digits-only payload is preserved and reformatted with the new country's mask.

## DtPaymentInput

Composes `DtInput` with 4-digit grouping and brand detection. The brand-icon itself is **not shipped** — provide your own SVG/img via the `#brand` slot.

### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string` | — | Formatted card number (with spaces). v-model. |
| `maxDigits` | `number` | `16` | Max digits accepted. Use `15` for Amex-only forms. |
| ... | | | All other `DtInput` props are forwarded. |

### Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string` | Fires with the formatted (spaced) value on every keystroke. |
| `brand-change` | `CardBrand` | Fires only when the detected brand changes. |

### `CardBrand`

```ts
type CardBrand = 'visa' | 'mastercard' | 'amex' | 'uzcard' | 'humo' | 'unknown'
```

Detection rules:

- **Visa** — starts with `4`
- **Mastercard** — `51`–`55` or `2221`–`2720`
- **Amex** — `34` or `37`
- **UzCard** — `8600`, `5614`, or `6262`
- **Humo** — `9860`

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtPaymentInput, type CardBrand } from '@/components/ui/input'

const card = ref('')
const brand = ref<CardBrand>('unknown')
</script>

<template>
  <DtPaymentInput v-model="card" label="Card number"
                  @brand-change="(b) => brand = b">
    <template #brand="{ brand }">
      <img v-if="brand === 'visa'"       src="/brands/visa.svg"       alt="Visa" />
      <img v-else-if="brand === 'mastercard'" src="/brands/mc.svg"    alt="Mastercard" />
      <span v-else aria-hidden="true">💳</span>
    </template>
  </DtPaymentInput>
</template>
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background` | Primary variant background. |
| `--dt-color-background-tertiary` | Secondary variant background. |
| `--dt-color-border` | Idle border (primary). |
| `--dt-color-border-hover` | Hover border (primary). |
| `--dt-color-accent` | Focus border + floating label color when focused. |
| `--dt-brand-100` | 3px focus ring. |
| `--dt-color-error` / `--dt-error-100` | Error border + ring. |
| `--dt-color-success` / `--dt-success-100` | Success border + ring. |
| `--dt-color-text` / `--dt-color-text-secondary` / `--dt-color-text-tertiary` | Value text / labels / placeholder. |
| `--dt-color-text-disabled` | Disabled value + placeholder. |
| `--dt-radius-md` / `lg` / `xl` | Per-size radius. |
| `--dt-text-body-sm` / `body-md` | Per-size font. |

## Accessibility

- Native `<input>` + `<label for>` association via `id`.
- `aria-invalid="true"` set when `state="error"`.
- `aria-describedby` connects the `message` line to the input.
- Floating label is CSS-only — no flicker, no JS state leak.
- Phone dropdown uses real `role="listbox"` + `aria-selected` on options.
- Clear button has an `aria-label="Clear"`.
