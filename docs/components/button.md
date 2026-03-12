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
  <DtButton>Default</DtButton>
</template>
```

## Variants

```vue
<template>
  <DtButton variant="default">Default</DtButton>
  <DtButton variant="secondary">Secondary</DtButton>
  <DtButton variant="outline">Outline</DtButton>
  <DtButton variant="ghost">Ghost</DtButton>
  <DtButton variant="destructive">Destructive</DtButton>
  <DtButton variant="link">Link</DtButton>
</template>
```

## Sizes

```vue
<template>
  <DtButton size="sm">Small</DtButton>
  <DtButton size="default">Default</DtButton>
  <DtButton size="lg">Large</DtButton>
  <DtButton size="icon">+</DtButton>
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
|------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | Visual style |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Button content |
| `icon-left` | Icon before text |
| `icon-right` | Icon after text |
