# Tab Switcher

A horizontal tab bar with an animated FLIP indicator, optional badges per tab, and string-keyed v-model. Designed for status filters on list pages.

```bash
npx dt-ui add tab-switcher
```

## Usage

```vue
<script setup lang="ts">
import { DtTabSwitcher, type DtTab } from '@/components/ui/tab-switcher'
import { ref } from 'vue'

const activeTab = ref('all')

const tabs: DtTab[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published', badge: '12' },
  { key: 'draft', label: 'Draft', badge: '3' },
  { key: 'archived', label: 'Archived' },
]
</script>

<template>
  <DtTabSwitcher v-model="activeTab" :tabs="tabs" />
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `tabs` | `DtTab[]` | **required** | Tab definitions |
| `modelValue` | `string` | **required** | Active tab key (v-model) |

### DtTab

```ts
interface DtTab {
  key: string
  label: string
  badge?: string
}
```

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string` | Emitted when the active tab changes |

::: info
The active indicator uses a FLIP animation — the underline measures its destination, animates from its previous position, and resizes via CSS transitions.
:::
