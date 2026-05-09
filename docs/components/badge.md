# Badge

A small status indicator with multiple variants.

```bash
npx dt-ui add badge
```

## Usage

```vue
<script setup lang="ts">
import { DtBadge } from '@/components/ui/badge'
</script>

<template>
  <DtBadge>Default</DtBadge>
</template>
```

## Variants

```vue
<template>
  <DtBadge variant="default">Default</DtBadge>
  <DtBadge variant="secondary">Secondary</DtBadge>
  <DtBadge variant="outline">Outline</DtBadge>
  <DtBadge variant="destructive">Error</DtBadge>
  <DtBadge variant="success">Active</DtBadge>
  <DtBadge variant="warning">Pending</DtBadge>
</template>
```

## With Status Dot

```vue
<template>
  <DtBadge variant="success" :dot="true">Online</DtBadge>
  <DtBadge variant="destructive" :dot="true">Offline</DtBadge>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'destructive' \| 'success' \| 'warning'` | `'default'` | Visual style |
| `size` | `'sm' \| 'default'` | `'default'` | Badge size |
| `dot` | `boolean` | `false` | Show status dot |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Badge content |
