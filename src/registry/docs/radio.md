# DtRadio

Radio button with three sizes, optional description text, and full keyboard/focus support. Wraps a visually-hidden `<input type="radio">` for native group behavior. Group multiple radios with the same `name` prop.

## Import

```ts
import { DtRadio } from '@/components/ui/radio'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string \| number` | — | Currently selected value in the group. Use with `v-model`. |
| `value` | `string \| number` | **required** | This radio's value. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Circle: 16 / 20 / 24 px. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| `name` | `string` | — | Group name for native radio behavior. |
| `label` | `string` | — | Inline label text. Default slot wins if both are provided. |
| `description` | `string` | — | Secondary text rendered under the label. |
| `id` | `string` | auto | HTML id for `<label for>` association. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string \| number` | Standard v-model. |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Label content. Overrides the `label` prop. |
| `description` | Description content. Overrides the `description` prop. |

## Usage

### Basic group

```vue
<script setup>
import { ref } from 'vue'
const plan = ref('free')
</script>

<template>
  <DtRadio v-model="plan" value="free" name="plan">Free</DtRadio>
  <DtRadio v-model="plan" value="pro" name="plan">Pro</DtRadio>
  <DtRadio v-model="plan" value="enterprise" name="plan">Enterprise</DtRadio>
</template>
```

### Label + description

```vue
<DtRadio
  v-model="plan"
  value="pro"
  name="plan"
  label="Pro"
  description="All features, priority support, 30-day trial."
/>
```

Or via slots:

```vue
<DtRadio v-model="plan" value="pro" name="plan">
  Pro
  <template #description>All features, priority support, 30-day trial.</template>
</DtRadio>
```

### Sizes

```vue
<DtRadio size="sm" v-model="x" value="a" name="g">Small</DtRadio>
<DtRadio size="md" v-model="x" value="b" name="g">Medium</DtRadio>
<DtRadio size="lg" v-model="x" value="c" name="g">Large</DtRadio>
```

### Disabled

```vue
<DtRadio disabled value="x" name="g">Off</DtRadio>
<DtRadio disabled v-model="model" value="x" name="g">On</DtRadio>
```

## States

| State | Visual |
| ----- | ------ |
| Default (unselected) | White bg + 1.5px `--dt-color-border-hover` outline |
| Hover (unselected) | Outline → `--dt-color-accent-hover` |
| Focus | Outer 2px `--dt-color-accent` ring at 5px offset |
| Selected | bg + border `--dt-color-accent`, white dot (animated pop) |
| Selected + hover | bg + border `--dt-color-accent-hover` |
| Disabled (unselected) | bg `--dt-gray-200`, outline `--dt-color-border-hover` |
| Disabled (selected) | bg + border `--dt-brand-200` |

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background` | Default unselected circle background. |
| `--dt-color-border-hover` | Default outline color (gray-300). |
| `--dt-color-accent` / `--dt-color-accent-hover` | Selected fill + hover. |
| `--dt-brand-200` | Disabled-selected fill. |
| `--dt-gray-200` | Disabled-unselected fill. |
| `--dt-radius-full` | Circle radius. |
| `--dt-color-white` | Inner dot. |
| `--dt-gray-700` / `--dt-gray-600` | Label / description text. |
| `--dt-color-text-disabled` | Disabled label + description. |

## Accessibility

- Native `<input type="radio">` under the hood — Tab to focus the group, Arrow keys to switch within it, native form integration.
- `<label for>` association via the auto-generated `id` (override with `id`).
- Focus ring uses `:focus-visible` so it only shows on keyboard focus, not mouse clicks.
- Click anywhere on the label (including description) selects the radio.
- Group multiple radios with the same `name` for native exclusive-selection behavior.
