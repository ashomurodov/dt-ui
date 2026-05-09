# Data Table

A slot-based data table with column configuration, loading and empty states, optional row striping, and per-cell scoped slots for custom rendering.

```bash
npx dt-ui add data-table
```

## Usage

```vue
<script setup lang="ts">
import { DtDataTable, type DtColumn } from '@/components/ui/data-table'
import { ref } from 'vue'

const columns: DtColumn[] = [
  { key: 'no', label: 'No', width: '64px' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role', hideOnMobile: true },
  { key: 'actions', label: '', align: 'right' },
]

const items = ref([
  { no: 1, name: 'Alice', role: 'Admin' },
  { no: 2, name: 'Bob', role: 'Editor' },
])

const loading = ref(false)
</script>

<template>
  <DtDataTable
    :columns="columns"
    :items="items"
    :loading="loading"
    empty-text="No users found"
  >
    <template #actions="{ item }">
      <button @click="edit(item)">Edit</button>
    </template>
  </DtDataTable>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `columns` | `DtColumn[]` | **required** | Column definitions |
| `items` | `unknown[]` | **required** | Row data |
| `loading` | `boolean` | `false` | Show loading spinner instead of rows |
| `emptyText` | `string` | — | Text shown when `items` is empty and not loading |
| `page` | `number` | `1` | Current page (used to compute `rowIndex` in slots) |
| `pageSize` | `number` | `10` | Page size (used to compute `rowIndex` in slots) |
| `striped` | `boolean` | `false` | Apply alternating row backgrounds |

### DtColumn

```ts
interface DtColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'right' | 'center'
  hideOnMobile?: boolean
}
```

## Slots

Each column gets a scoped slot named after its `key`. The slot receives `{ item, index, rowIndex }`:

```vue
<template #status="{ item }">
  <DtStatusBadge :variant="item.status">{{ item.statusLabel }}</DtStatusBadge>
</template>
```

`rowIndex` is the 1-based row number across all pages: `index + 1 + (page - 1) * pageSize`.

## Optional Cell Styles

The package ships a companion stylesheet for shared cell patterns (title with thumbnail, price, action buttons). Import once in `main.ts`:

```ts
import '@/styles/table-cells.css'
```

This unlocks classes like `.dt-cell-title`, `.dt-cell-price`, and `.dt-action-btn`.
