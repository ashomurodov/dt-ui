# DtToggle

A switch toggle component with 3 sizes (lg/md/sm) and smooth thumb animation. Uses `role="switch"` with `aria-checked` for accessibility.

## Import

```ts
import { DtToggle } from '@/components/ui/toggle'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `false` | Toggle state. Use with `v-model`. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Toggle size. |
| `disabled` | `boolean` | `false` | Disables the toggle. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Emitted when toggled. |

## Sizes (Figma)

| Size | Track | Thumb |
| ------ | ------- | ------- |
| `lg` | 44x24px | 20px |
| `md` | 36x20px | 16px |
| `sm` | 32x18px | 14px |

## Usage

```vue
<DtToggle v-model="enabled" />
<DtToggle v-model="enabled" size="lg" />
<DtToggle v-model="enabled" disabled />
```

## States

- **Off**: `--dt-gray-200` track, white thumb
- **Hover**: `--dt-gray-300` track
- **On**: `--dt-color-accent` track, white thumb
- **Disabled**: 50% opacity
