# DtSelect

A Reka UI backed select component with DT styling. It keeps the existing compound API (`DtSelect`, `DtSelectTrigger`, `DtSelectContent`, `DtSelectItem`) while delegating selection state, positioning, typeahead, focus management, ARIA attributes, and keyboard navigation to `reka-ui`.

## Dependency

This component imports primitives from `reka-ui`. The `dt-ui` CLI installs `reka-ui@2.9.6` when you run:

```bash
npx dt-ui add select
```

## Import

```ts
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'

const fruit = ref<string | null>(null)
</script>

<template>
  <DtSelect v-model="fruit" placeholder="Choose a fruit...">
    <DtSelectTrigger />
    <DtSelectContent>
      <DtSelectItem value="apple" label="Apple" />
      <DtSelectItem value="banana" label="Banana" />
      <DtSelectItem value="cherry" label="Cherry" />
    </DtSelectContent>
  </DtSelect>
</template>
```

You can still provide custom trigger content:

```vue
<DtSelectTrigger>
  {{ fruit ?? 'Choose a fruit...' }}
</DtSelectTrigger>
```

## DtSelect Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | `undefined` | Controlled selected value. Use with `v-model`. |
| `defaultValue` | `string \| number` | `undefined` | Initial uncontrolled value. |
| `placeholder` | `string` | `'Select an option...'` | Placeholder used by the default trigger value. |
| `disabled` | `boolean` | `false` | Disables the entire select. |
| `name` | `string` | `undefined` | Native form field name forwarded to Reka UI. |
| `required` | `boolean` | `false` | Native form required state forwarded to Reka UI. |

## DtSelectTrigger

Renders a Reka `SelectTrigger` styled as the DT trigger. If no default slot is provided, it displays Reka `SelectValue`, which shows the selected item's text or the `placeholder`.

## DtSelectContent

Renders a teleported Reka `SelectContent` using `position="popper"`, aligned to the trigger width. The default slot should contain `DtSelectItem` components.

| Slot | Description |
|------|-------------|
| `default` | Select items. |
| `search` | Optional custom content above the item list. |
| `empty` | Optional empty-state content. |

## DtSelectItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | required | Item value. Must not be an empty string. |
| `label` | `string` | `String(value)` | Text used for typeahead and default selected display. |
| `disabled` | `boolean` | `false` | Prevents selection. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| null` | Emitted when the selected value changes. |

## Accessibility

Reka UI provides the select-only combobox/listbox behavior: ARIA roles and state attributes, roving item focus, typeahead, Escape dismissal, and Arrow/Enter/Space keyboard interactions. Keep a visible label or pass an accessible label to the trigger when the surrounding form does not already identify the field.
