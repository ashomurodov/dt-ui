# Select

Custom dropdown select with Reka UI powered keyboard navigation, typeahead, focus management, and ARIA behavior.

```bash
npx dt-ui add select
```

## Usage

```vue
<script setup lang="ts">
import { DtSelect, DtSelectTrigger, DtSelectContent, DtSelectItem } from '@/components/ui/select'
import { ref } from 'vue'

const fruit = ref(null)
</script>

<template>
  <DtSelect v-model="fruit">
    <DtSelectTrigger>
      {{ fruit || 'Choose a fruit...' }}
    </DtSelectTrigger>
    <DtSelectContent>
      <DtSelectItem value="apple" label="Apple">Apple</DtSelectItem>
      <DtSelectItem value="banana" label="Banana">Banana</DtSelectItem>
      <DtSelectItem value="cherry" label="Cherry">Cherry</DtSelectItem>
    </DtSelectContent>
  </DtSelect>
</template>
```

## Keyboard Navigation

- **Arrow Down/Up** — Navigate items
- **Enter/Space** — Select highlighted item or open dropdown
- **Escape** — Close dropdown

## DtSelect Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string \| number \| null` | `null` | Selected value (v-model) |
| `defaultValue` | `string \| number` | — | Initial uncontrolled value |
| `placeholder` | `string` | `'Select an option...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the select |
| `name` | `string` | — | Native form field name |
| `required` | `boolean` | `false` | Native required state |

## DtSelectItem Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `value` | `string \| number` | **required** | Option value |
| `label` | `string` | — | Display label (used for selected text and typeahead) |
| `disabled` | `boolean` | `false` | Disable this option |

## Sub-components

| Component | Description |
| ----------- | ------------- |
| `DtSelectTrigger` | The button that opens the dropdown |
| `DtSelectContent` | The dropdown panel. Has `search` and `empty` slots. |
| `DtSelectItem` | Individual option in the list |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string \| number \| null` | Emitted when selection changes |

## Accessibility

- `role="combobox"` on trigger with `aria-expanded`
- `role="listbox"` on content
- `role="option"` with `aria-selected` on items

::: info
`DtSelect` is built on `reka-ui`. The CLI installs `reka-ui@2.9.6` when this component is added.
:::
