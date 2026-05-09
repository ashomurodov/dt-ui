# Checkbox

A checkbox with optional label slot, three sizes, and animated check icon. Uses a hidden native `<input type="checkbox">` for accessibility.

```bash
npx dt-ui add checkbox
```

## Usage

```vue
<script setup lang="ts">
import { DtCheckbox } from '@/components/ui/checkbox'
import { ref } from 'vue'

const agreed = ref(false)
</script>

<template>
  <DtCheckbox v-model="agreed">I agree to the terms</DtCheckbox>
</template>
```

## Sizes

```vue
<template>
  <DtCheckbox v-model="agreed" size="sm">Small</DtCheckbox>
  <DtCheckbox v-model="agreed" size="md">Medium</DtCheckbox>
  <DtCheckbox v-model="agreed" size="lg">Large</DtCheckbox>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `false` | Checked state (v-model) |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Checkbox size |
| `disabled` | `boolean` | `false` | Disable the checkbox |
| `id` | `string` | auto-generated | HTML id for label association |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Label text rendered next to the checkbox |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Emitted when toggled |

## Sizes (Box × Check Icon)

| Size | Box | Check |
| ------ | ----- | ------- |
| `lg` | 24×24px | 14px |
| `md` | 20×20px | 12px |
| `sm` | 16×16px | 10px |
