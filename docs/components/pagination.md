# Pagination

Page navigation with previous/next arrows and a numbered window with ellipses.

```bash
npx dt-ui add pagination
```

## Usage

```vue
<script setup lang="ts">
import { DtPagination } from '@/components/ui/pagination'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <DtPagination
    v-model:page="page"
    :total-count="245"
    :page-size="20"
  />
</template>
```

## Page Window Behavior

The component renders a stable 5-page window with leading/trailing ellipses:

- **Near start:** `1 2 3 4 5 … 50`
- **Middle:** `1 … 14 15 16 17 18 … 50`
- **Near end:** `1 … 46 47 48 49 50`

When total pages ≤ 7, all pages are rendered without ellipses.

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `page` | `number` | **required** | Current page (v-model:page) |
| `totalCount` | `number` | **required** | Total item count (used with `pageSize` to compute total pages) |
| `pageSize` | `number` | `10` | Items per page |
| `variant` | `'primary' \| 'secondary'` | `'secondary'` | Visual style |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Pagination size |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:page` | `number` | Emitted when the active page changes |
