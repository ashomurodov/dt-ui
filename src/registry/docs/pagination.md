# DtPagination

A page navigation component with previous/next arrows and numbered page buttons. Shows a sliding window of up to 3 page numbers centered on the current page. Automatically hides when there is only one page.

## Import

```ts
import { DtPagination } from '@/components/ui/pagination'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | **required** | Current active page (1-based). Use with `v-model:page`. |
| `totalCount` | `number` | **required** | Total number of items across all pages. |
| `pageSize` | `number` | `10` | Number of items per page. Used to calculate total pages. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | Emitted when a page button or arrow is clicked. |

## Usage Examples

### Basic Pagination

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtPagination } from '@/components/ui/pagination'

const page = ref(1)
const totalCount = ref(85)
</script>

<template>
  <DtPagination v-model:page="page" :total-count="totalCount" :page-size="10" />
</template>
```

### With Data Fetch

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { DtPagination } from '@/components/ui/pagination'

const page = ref(1)
const totalCount = ref(0)

watch(page, () => fetchData())

async function fetchData() {
  const { data } = await api.getItems({ page: page.value, pageSize: 10 })
  totalCount.value = data.total_count
}
</script>

<template>
  <DtPagination v-model:page="page" :total-count="totalCount" />
</template>
```

## CSS Custom Properties

| Property | Usage |
|----------|-------|
| `--dt-color-text` | Page number text color. |
| `--dt-color-accent` | Active page button background. |
| `--dt-color-accent-hover` | Active page button hover background. |
| `--dt-color-background-secondary` | Inactive page button hover background. |
| `--dt-radius-md` | Button border-radius (9px). |
| `--dt-text-base` | Page number font size. |
| `--dt-space-6` | Top margin (24px). |
| `--dt-transition-fast` | Hover transition. |

## Behavior

- Automatically hides when `totalCount <= pageSize` (1 page).
- Previous/next arrows are disabled at boundaries.
- Shows a maximum of 3 page numbers at a time, centered on the current page.
- Arrows use inline SVG (no external icon dependencies).
