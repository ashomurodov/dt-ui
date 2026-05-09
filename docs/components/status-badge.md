# Status Badge

A semantic status pill for entity states (active, inactive, in moderation, canceled, rejected, blocked). Use this when the badge's color must convey meaning, not just look pretty.

```bash
npx dt-ui add status-badge
```

## Usage

```vue
<script setup lang="ts">
import { DtStatusBadge } from '@/components/ui/status-badge'
</script>

<template>
  <DtStatusBadge variant="active">Active</DtStatusBadge>
  <DtStatusBadge variant="inactive">Inactive</DtStatusBadge>
  <DtStatusBadge variant="moderation">In moderation</DtStatusBadge>
  <DtStatusBadge variant="canceled">Canceled</DtStatusBadge>
  <DtStatusBadge variant="rejected">Rejected</DtStatusBadge>
  <DtStatusBadge variant="blocked">Blocked</DtStatusBadge>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `StatusVariant` | **required** | Semantic status color |

### Type Reference

```ts
type StatusVariant = 'active' | 'inactive' | 'moderation' | 'canceled' | 'rejected' | 'blocked'
```

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Status label text |

::: info
For non-semantic colored badges (e.g. category tags, counts), use `DtBadge` instead.
:::
