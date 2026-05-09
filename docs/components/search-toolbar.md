# Search Toolbar

A search input paired with an optional primary action button. Common header for list pages: search on the left, "Create" on the right.

```bash
npx dt-ui add search-toolbar
```

## Usage

```vue
<script setup lang="ts">
import { DtSearchToolbar } from '@/components/ui/search-toolbar'
import { ref } from 'vue'

const search = ref('')

function onAdd() {
  // open create modal
}

function onSearch() {
  // refetch list
}
</script>

<template>
  <DtSearchToolbar
    v-model:search="search"
    search-placeholder="Search documents..."
    add-label="Create"
    @add="onAdd"
    @search="onSearch"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `search` | `string` | `''` | Search query (v-model:search) |
| `searchPlaceholder` | `string` | — | Placeholder text for the search input |
| `addLabel` | `string` | — | Action button label. Omit to hide the button. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:search` | `string` | Emitted as the user types |
| `search` | — | Emitted on every input event (debounce in your handler if needed) |
| `add` | — | Emitted when the action button is clicked |

::: tip
The `search` event fires on every keystroke. For API-driven lists, debounce the handler in your page code to avoid request spam.
:::
