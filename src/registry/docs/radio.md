# DtRadio

A radio button component with 3 sizes (lg/md/sm), animated selection dot, and label slot. Uses a hidden native `<input type="radio">` for accessibility. Group multiple radios with the same `name` prop.

## Import

```ts
import { DtRadio } from '@/components/ui/radio'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Currently selected value in the group. Use with `v-model`. |
| `value` | `string \| number` | **required** | This radio's value. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Radio size. |
| `disabled` | `boolean` | `false` | Disables the radio. |
| `name` | `string` | — | Group name for native radio behavior. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted when selected. |

## Sizes (Figma)

| Size | Circle | Inner Dot |
|------|--------|-----------|
| `lg` | 24x24px | 10px |
| `md` | 20x20px | 8px |
| `sm` | 16x16px | 6px |

## Usage

```vue
<script setup>
const plan = ref('free')
</script>

<template>
  <DtRadio v-model="plan" value="free" name="plan">Free</DtRadio>
  <DtRadio v-model="plan" value="pro" name="plan">Pro</DtRadio>
  <DtRadio v-model="plan" value="enterprise" name="plan">Enterprise</DtRadio>
</template>
```

## States

- **Unselected**: `--dt-gray-200` background
- **Hover**: `--dt-gray-300` background
- **Selected**: `--dt-color-accent` background, white dot (animated pop)
- **Disabled**: `--dt-gray-100` background, muted label
