# DtCheckbox

A checkbox component with 3 sizes (lg/md/sm), animated checkmark, and label slot. Uses a hidden native `<input type="checkbox">` for accessibility.

## Import

```ts
import { DtCheckbox } from '@/components/ui/checkbox'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `false` | Checked state. Use with `v-model`. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Checkbox size. |
| `disabled` | `boolean` | `false` | Disables the checkbox. |
| `id` | `string` | auto-generated | HTML id for label association. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Emitted when toggled. |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Label text next to the checkbox. |

## Sizes

| Size | Box | Check Icon |
| ------ | ----- | ------------ |
| `lg` | 24x24px | 14px |
| `md` | 20x20px | 12px |
| `sm` | 16x16px | 10px |

## Usage

```vue
<DtCheckbox v-model="agreed">I agree to the terms</DtCheckbox>
<DtCheckbox v-model="agreed" size="lg" />
<DtCheckbox v-model="agreed" disabled>Disabled</DtCheckbox>
```

## States

- **Unchecked**: `--dt-gray-200` background
- **Hover**: `--dt-gray-300` background
- **Checked**: `--dt-color-accent` background, white checkmark
- **Disabled**: `--dt-gray-100` background, muted label
