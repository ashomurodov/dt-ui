# Radio

A radio button for selecting one option from a group, with three sizes and an animated selection dot.

```bash
npx dt-ui add radio
```

## Usage

```vue
<script setup lang="ts">
import { DtRadio } from '@/components/ui/radio'
import { ref } from 'vue'

const plan = ref('free')
</script>

<template>
  <DtRadio v-model="plan" value="free" name="plan">Free</DtRadio>
  <DtRadio v-model="plan" value="pro" name="plan">Pro</DtRadio>
  <DtRadio v-model="plan" value="team" name="plan">Team</DtRadio>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string \| number` | — | Selected group value (v-model) |
| `value` | `string \| number` | **required** | This option's value |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Radio size |
| `disabled` | `boolean` | `false` | Disable the radio |
| `name` | `string` | — | Native form group name |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Label text rendered next to the radio |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string \| number` | Emitted when this option is selected |

::: tip
Pass the same `name` to all radios in a group so the native form treats them as a single field.
:::
