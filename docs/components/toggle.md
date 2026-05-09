# Toggle

A switch toggle for boolean settings, with three sizes.

```bash
npx dt-ui add toggle
```

## Usage

```vue
<script setup lang="ts">
import { DtToggle } from '@/components/ui/toggle'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <DtToggle v-model="enabled" />
</template>
```

## Sizes

```vue
<template>
  <DtToggle v-model="enabled" size="sm" />
  <DtToggle v-model="enabled" size="md" />
  <DtToggle v-model="enabled" size="lg" />
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `false` | Active state (v-model) |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Toggle size |
| `disabled` | `boolean` | `false` | Disable the toggle |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Emitted when toggled |

## Accessibility

- Renders a native `<button role="switch">` with `aria-checked`.
- Keyboard-focusable; activate with Enter/Space.
- `:focus-visible` ring uses `--dt-color-ring`.
