# DtSearchToolbar

A horizontal toolbar with a search input and an optional action button. Designed for use at the top of list/table views. Contains built-in search and plus icons (no external icon dependencies). Responsive — stacks vertically on mobile.

## Import

```ts
import { DtSearchToolbar } from '@/components/ui/search-toolbar'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `search` | `string` | `''` | The search input value. Use with `v-model:search`. |
| `searchPlaceholder` | `string` | `undefined` | Placeholder text for the search input. |
| `addLabel` | `string` | `undefined` | Label for the action button. If not provided, the button is hidden. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:search` | `string` | Emitted on every input keystroke (v-model). |
| `search` | — | Emitted on each input event. Use this to trigger debounced fetching. |
| `add` | — | Emitted when the action button is clicked. |

## Usage Examples

### Basic Search + Add

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtSearchToolbar } from '@/components/ui/search-toolbar'

const search = ref('')

let timer: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => fetchData(), 400)
}
</script>

<template>
  <DtSearchToolbar
    v-model:search="search"
    search-placeholder="Search"
    add-label="Add"
    @search="handleSearch"
    @add="router.push('/create')"
  />
</template>
```

### Search Only (no button)

```vue
<DtSearchToolbar v-model:search="search" search-placeholder="Filter..." @search="handleSearch" />
```

## CSS Custom Properties

| Property | Usage |
|----------|-------|
| `--dt-color-border` | Search input border. |
| `--dt-color-background` | Search input background. |
| `--dt-color-text` | Search input text. |
| `--dt-color-text-tertiary` | Placeholder and search icon color. |
| `--dt-color-accent` | Action button background and search input focus border. |
| `--dt-color-accent-hover` | Action button hover background. |
| `--dt-radius-lg` | Search input border-radius (16px). |
| `--dt-radius-base` | Action button border-radius (12px). |
| `--dt-text-sm` | Font size (14px). |
| `--dt-space-4` | Gap between search and button; input left padding. |
| `--dt-space-2` | Button icon-to-label gap. |
| `--dt-transition-fast` | Focus/hover transitions. |

## Responsive Behavior

Below 768px:
- Toolbar stacks vertically (`flex-direction: column`).
- Search input becomes full width.
- Action button centers its content.
