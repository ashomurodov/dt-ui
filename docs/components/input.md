# Input

A text input with label, error, and hint support.

```bash
npx dt-ui add input
```

## Usage

```vue
<script setup lang="ts">
import { DtInput } from '@/components/ui/input'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <DtInput v-model="name" placeholder="Enter your name">
    <template #label>Name</template>
  </DtInput>
</template>
```

## With Error

```vue
<template>
  <DtInput v-model="email" type="email" error="Please enter a valid email">
    <template #label>Email</template>
  </DtInput>
</template>
```

## With Hint

```vue
<template>
  <DtInput v-model="username" hint="Must be at least 3 characters">
    <template #label>Username</template>
  </DtInput>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Bound value (v-model) |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Input type |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `string` | — | Error message |
| `hint` | `string` | — | Hint text below input |
| `id` | `string` | auto-generated | Input element ID |

## Slots

| Slot | Description |
|------|-------------|
| `label` | Label content above the input |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted on input |
