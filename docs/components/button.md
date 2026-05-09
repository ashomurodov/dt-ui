# Button

A clickable button with multiple variants and sizes.

```bash
npx dt-ui add button
```

## Usage

```vue
<script setup lang="ts">
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <DtButton>Primary</DtButton>
</template>
```

## Variants

```vue
<template>
  <DtButton variant="primary">Primary</DtButton>
  <DtButton variant="secondary">Secondary</DtButton>
  <DtButton variant="outline">Outline</DtButton>
  <DtButton variant="ghost">Ghost</DtButton>
</template>
```

## Sizes

```vue
<template>
  <DtButton size="xs">Extra Small</DtButton>
  <DtButton size="sm">Small</DtButton>
  <DtButton size="md">Medium</DtButton>
  <DtButton size="lg">Large</DtButton>
  <DtButton size="xl">Extra Large</DtButton>
</template>
```

## Loading State

```vue
<template>
  <DtButton :loading="true">Saving...</DtButton>
</template>
```

## With Icons

```vue
<template>
  <DtButton>
    <template #icon-left>
      <svg><!-- your icon --></svg>
    </template>
    Save
  </DtButton>
</template>
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'xl' \| 'lg' \| 'md' \| 'sm' \| 'xs'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Button content |
| `icon-left` | Icon before text |
| `icon-right` | Icon after text |
