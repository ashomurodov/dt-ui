# DtCheckbox

Checkbox with three sizes, indeterminate state, optional description text, and full keyboard/focus support. Wraps a visually-hidden `<input type="checkbox">` for native form integration.

## Import

```ts
import { DtCheckbox } from '@/components/ui/checkbox'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `false` | Checked state. Use with `v-model`. |
| `indeterminate` | `boolean` | `false` | Visual partially-checked state. Renders a horizontal dash glyph instead of the checkmark. Doesn't change `modelValue` — caller decides when to clear it. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Box: 16 / 20 / 24 px. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| `label` | `string` | — | Inline label text. Default slot wins if both are provided. |
| `description` | `string` | — | Secondary text rendered under the label. |
| `id` | `string` | auto | HTML id for `<label for>` association. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Standard v-model. |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Label content. Overrides the `label` prop. |
| `description` | Description content. Overrides the `description` prop. |

## Usage

### Basic

```vue
<DtCheckbox v-model="agreed">I agree to the terms</DtCheckbox>
```

### Indeterminate

Typical use: a parent "select all" that's mixed when only some children are checked.

```vue
<DtCheckbox v-model="all" :indeterminate="some && !all">Select all</DtCheckbox>
```

The `indeterminate` flag is purely visual — the parent component decides when to flip it back off based on its child state.

### Label + description

```vue
<DtCheckbox
  v-model="remember"
  label="Remember me"
  description="Save my login details for next time."
/>
```

Or via slots:

```vue
<DtCheckbox v-model="remember">
  Remember me
  <template #description>Save my login details for next time.</template>
</DtCheckbox>
```

### Sizes

```vue
<DtCheckbox size="sm" v-model="x">Small</DtCheckbox>
<DtCheckbox size="md" v-model="x">Medium</DtCheckbox>
<DtCheckbox size="lg" v-model="x">Large</DtCheckbox>
```

### Disabled

```vue
<DtCheckbox disabled>Off</DtCheckbox>
<DtCheckbox disabled :model-value="true">On</DtCheckbox>
<DtCheckbox disabled indeterminate>Mixed</DtCheckbox>
```

## States

| State | Visual |
| ----- | ------ |
| Default (unchecked) | White bg + 1.5px `--dt-color-border-hover` outline |
| Hover (unchecked) | Outline → `--dt-color-accent-hover` |
| Focus | Outer 2px `--dt-color-accent` ring at 5px offset |
| Checked / Indeterminate | bg + border `--dt-color-accent`, white glyph |
| Checked + hover | bg + border `--dt-color-accent-hover` |
| Disabled (unchecked) | bg `--dt-gray-200`, outline `--dt-color-border-hover` |
| Disabled (checked / indeterminate) | bg + border `--dt-brand-200` |

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background` | Default unchecked box background. |
| `--dt-color-border-hover` | Default outline color (gray-300). |
| `--dt-color-accent` / `--dt-color-accent-hover` | Checked / indeterminate fill + hover. |
| `--dt-brand-200` | Disabled-checked fill. |
| `--dt-gray-200` | Disabled-unchecked fill. |
| `--dt-radius-xs` | Box radius (6px). |
| `--dt-gray-700` / `--dt-gray-600` | Label / description text. |
| `--dt-color-text-disabled` | Disabled label + description. |

## Accessibility

- Native `<input type="checkbox">` under the hood — full keyboard support (Tab to focus, Space to toggle), form integration, and screen-reader semantics for free.
- `<label for>` association via the auto-generated `id` (override with the `id` prop).
- `aria-checked="mixed"` is set when `indeterminate` is true.
- Focus ring uses `:focus-visible` so it only appears on keyboard focus, not mouse clicks.
- Click anywhere on the label (including the description) toggles the checkbox.
