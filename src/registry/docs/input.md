# DtInput

A text input component with built-in label, error message, and hint text support. Wraps a native `<input>` element and provides two-way binding through `v-model`. Automatically links the label and error/hint text to the input using generated or user-supplied `id` values for proper accessibility.

## Import

```ts
import { DtInput } from '@/components/ui/input'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string \| number` | `undefined` | The bound value. Use with `v-model`. |
| `type` | `InputType` | `'text'` | The native input type. |
| `placeholder` | `string` | `undefined` | Placeholder text shown when the input is empty. |
| `disabled` | `boolean` | `false` | Disables the input (reduces opacity, sets `cursor: not-allowed`, and applies `--dt-color-background-tertiary` background). |
| `error` | `string` | `undefined` | Error message text. When set, the input border turns red and the error message is displayed below the input. |
| `hint` | `string` | `undefined` | Hint text displayed below the input. Only shown when `error` is not set. |
| `id` | `string` | auto-generated | HTML `id` for the input element. If not provided, a random id (`dt-input-*`) is generated. Used to associate the label and describedby elements. |

### Type Reference

```ts
type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
```

## Slots

| Slot | Description |
| ------ | ------------- |
| `label` | Content for the `<label>` element above the input. The label automatically receives a `for` attribute pointing to the input `id`. If this slot is empty, no label is rendered. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string \| number` | Emitted on every input event. When `type="number"`, the value is coerced to `Number` before emitting. |

All other native input events (`focus`, `blur`, `keydown`, etc.) are forwarded through `v-bind="attrs"` on the `<input>` element.

## Usage Examples

### Basic Text Input

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtInput } from '@/components/ui/input'

const name = ref('')
</script>

<template>
  <DtInput v-model="name" placeholder="Enter your name">
    <template #label>Full Name</template>
  </DtInput>
</template>
```

### Input with Validation Error and Hint

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { DtInput } from '@/components/ui/input'

const email = ref('')

const emailError = computed(() => {
  if (!email.value) return undefined
  return email.value.includes('@') ? undefined : 'Please enter a valid email address'
})
</script>

<template>
  <DtInput
    v-model="email"
    type="email"
    placeholder="you@example.com"
    :error="emailError"
    hint="We will never share your email with anyone."
  >
    <template #label>Email Address</template>
  </DtInput>
</template>
```

### Composed with DtCard and DtButton for a Login Form

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtInput } from '@/components/ui/input'
import { DtButton } from '@/components/ui/button'
import { DtCard, DtCardHeader, DtCardContent, DtCardFooter } from '@/components/ui/card'

const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  // ... perform login
  loading.value = false
}
</script>

<template>
  <DtCard :shadow="true" style="max-width: 24rem;">
    <DtCardHeader>
      <h3>Sign In</h3>
      <p>Enter your credentials to access your account.</p>
    </DtCardHeader>
    <DtCardContent>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <DtInput v-model="email" type="email" placeholder="you@example.com">
          <template #label>Email</template>
        </DtInput>
        <DtInput v-model="password" type="password" placeholder="Your password">
          <template #label>Password</template>
        </DtInput>
      </div>
    </DtCardContent>
    <DtCardFooter>
      <DtButton :loading="loading" style="width: 100%;" @click="submit">
        Sign In
      </DtButton>
    </DtCardFooter>
  </DtCard>
</template>
```

## CSS Custom Properties

### Colors

| Property | Usage |
| ---------- | ------- |
| `--dt-color-text` | Input text color and label color. |
| `--dt-color-background` | Input background color. |
| `--dt-color-background-tertiary` | Disabled input background color. |
| `--dt-color-text-secondary` | Placeholder text color and hint text color. |
| `--dt-color-border` | Default border color. |
| `--dt-color-border-hover` | Border color on hover. |
| `--dt-color-ring` | Border and box-shadow color on focus. |
| `--dt-color-error` | Border and box-shadow color when `error` is set. Also used for error text color. |

### Layout & Typography

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-xs` | Gap between label, input, and error/hint elements. |
| `--dt-radius-sm` | Input border-radius. |
| `--dt-text-xs` | Error and hint text font size. |
| `--dt-text-sm` | Label font size. |
| `--dt-text-base` | Input text font size. |
| `--dt-transition-base` | Duration/easing for border-color and box-shadow transitions. |

## Accessibility

- The `<label>` element uses a `for` attribute linked to the input `id`, providing a clickable label that focuses the input.
- When `error` is set, `aria-invalid="true"` is added to the input, signaling the invalid state to assistive technologies.
- The `aria-describedby` attribute is dynamically set to point at either the error element (id: `{id}-error`) or the hint element (id: `{id}-hint`), so screen readers announce the supplementary text when the input is focused.
- Error messages are rendered with `role="alert"`, causing screen readers to announce them immediately when they appear.
- The disabled state uses both the native `disabled` attribute and an opacity wrapper class, ensuring the input is removed from the tab order.
- Focus styles use a visible box-shadow ring (`color-mix(in srgb, var(--dt-ring) 25%, transparent)`) in addition to the border color change, providing a clear visual indicator for keyboard users.
