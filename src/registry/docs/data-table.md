# DtDataTable

A data table component driven by column configuration and slot-based cell rendering. Supports loading state, empty state, pagination-aware row indexing, mobile-responsive column hiding, and optional zebra-striped rows. Renders a native `<table>` element with separated row borders and rounded corners.

## Import

```ts
import { DtDataTable } from '@/components/ui/data-table'
import type { DtColumn } from '@/components/ui/data-table'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `columns` | `DtColumn[]` | **required** | Array of column definitions controlling header labels, widths, alignment, and mobile visibility. |
| `items` | `unknown[]` | **required** | Array of data objects to render as rows. |
| `loading` | `boolean` | `false` | Shows a centered spinner instead of rows. |
| `emptyText` | `string` | `undefined` | Text displayed when `items` is empty and not loading. |
| `page` | `number` | `1` | Current page number, used to calculate `rowIndex` in slots. |
| `pageSize` | `number` | `10` | Items per page, used to calculate `rowIndex` in slots. |
| `striped` | `boolean` | `false` | Enables alternating row backgrounds (white / `--dt-color-background-tertiary`). |

### DtColumn Interface

```ts
interface DtColumn {
  key: string           // Unique column identifier, also used as slot name
  label: string         // Header text
  width?: string        // CSS width (e.g., '40px', '35%', '150px')
  align?: 'left' | 'right' | 'center'  // Text alignment for header and cells
  hideOnMobile?: boolean // Hides column below 768px
}
```

## Slots

Each column `key` becomes a named slot for custom cell rendering:

| Slot | Props | Description |
| ------ | ------- | ------------- |
| `[column.key]` | `{ item: any, index: number, rowIndex: number }` | Custom cell content. `index` is 0-based within the page, `rowIndex` is the absolute row number across all pages. Falls back to `item[column.key]` if slot is not provided. |

## Usage Examples

### Basic Table

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtDataTable } from '@/components/ui/data-table'
import type { DtColumn } from '@/components/ui/data-table'

const columns: DtColumn[] = [
  { key: 'no', label: 'No', width: '40px', align: 'right' },
  { key: 'title', label: 'Name', width: '40%' },
  { key: 'price', label: 'Price', width: '150px', hideOnMobile: true },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const items = ref([
  { title: 'Service A', price: 50000 },
  { title: 'Service B', price: 120000 },
])
</script>

<template>
  <DtDataTable :columns="columns" :items="items" :page="1" :page-size="10" empty-text="No items found">
    <template #no="{ rowIndex }">{{ rowIndex }}</template>
    <template #title="{ item }">{{ item.title }}</template>
    <template #price="{ item }">{{ item.price.toLocaleString() }} UZS</template>
    <template #actions="{ item }">
      <button @click="edit(item)">Edit</button>
    </template>
  </DtDataTable>
</template>
```

### Striped Table (for reports)

```vue
<DtDataTable :columns="columns" :items="items" striped />
```

### Composed with Pagination

```vue
<script setup lang="ts">
import { DtDataTable } from '@/components/ui/data-table'
import { DtPagination } from '@/components/ui/pagination'

const page = ref(1)
const totalCount = ref(100)
</script>

<template>
  <DtDataTable :columns="columns" :items="items" :page="page" :page-size="10" :loading="loading" />
  <DtPagination v-model:page="page" :total-count="totalCount" :page-size="10" />
</template>
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-icon-secondary` | Table header text color. |
| `--dt-color-text` | Cell text color. |
| `--dt-color-background` | Default row background. |
| `--dt-color-background-secondary` | Row hover background. |
| `--dt-color-background-tertiary` | Striped even-row background. |
| `--dt-color-text-tertiary` | Empty state / loading text color. |
| `--dt-color-border-light` | Spinner border color. |
| `--dt-color-accent` | Spinner top-border color. |
| `--dt-radius-lg` | Row corner radius (16px). |
| `--dt-text-body-xs` | Cell font size (12px). |
| `--dt-text-body-sm` | Empty state font size (14px). |
| `--dt-transition-fast` | Row hover transition. |
