# DtBadge

A small inline status indicator for labeling, categorizing, or highlighting information. Renders as a `<span>` with pill-shaped border-radius and supports multiple color variants, two sizes, and an optional status dot.

## Import

```ts
import { DtBadge } from '@/components/ui/badge'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `BadgeVariant` | `'default'` | Color variant controlling background, text, and border colors. |
| `size` | `BadgeSize` | `'default'` | Controls padding and font size. |
| `dot` | `boolean` | `false` | Renders a small circular dot before the badge text, using `currentColor`. Useful as a status indicator. |

### Type Reference

```ts
type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
type BadgeSize = 'sm' | 'default'
```

### Variant Behavior

| Variant | Background | Text Color | Border |
| --------- | ----------- | ------------ | -------- |
| `default` | `--dt-color-accent` | `--dt-color-accent-foreground` | transparent |
| `secondary` | `--dt-color-secondary` | `--dt-color-secondary-foreground` | transparent |
| `outline` | transparent | `--dt-color-text` | `--dt-color-border` |
| `destructive` | `--dt-color-error` | `--dt-color-error-foreground` | transparent |
| `success` | `--dt-color-success` | `--dt-color-success-foreground` | transparent |
| `warning` | `--dt-color-warning` | `--dt-color-warning-foreground` | transparent |

### Size Reference

| Size | Padding | Font Size |
| ------ | --------- | ----------- |
| `sm` | 0.125rem 0.375rem | `--dt-text-body-xs` |
| `default` | 0.25rem 0.5rem | `--dt-text-body-xs` |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Badge text content. |

## Events

DtBadge does not emit custom events. Native events are forwarded through `v-bind="$attrs"`.

## Usage Examples

### Basic Badge

```vue
<script setup lang="ts">
import { DtBadge } from '@/components/ui/badge'
</script>

<template>
  <DtBadge>New</DtBadge>
</template>
```

### All Variants and Sizes

```vue
<script setup lang="ts">
import { DtBadge } from '@/components/ui/badge'
</script>

<template>
  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
    <DtBadge variant="default">Default</DtBadge>
    <DtBadge variant="secondary">Secondary</DtBadge>
    <DtBadge variant="outline">Outline</DtBadge>
    <DtBadge variant="destructive">Error</DtBadge>
    <DtBadge variant="success">Active</DtBadge>
    <DtBadge variant="warning">Pending</DtBadge>
  </div>

  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
    <DtBadge size="sm">Small</DtBadge>
    <DtBadge size="default">Default</DtBadge>
  </div>

  <!-- With dot indicator -->
  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
    <DtBadge variant="success" :dot="true">Online</DtBadge>
    <DtBadge variant="destructive" :dot="true">Offline</DtBadge>
    <DtBadge variant="warning" :dot="true">Away</DtBadge>
  </div>
</template>
```

### Composed with DtCard for a Status Dashboard

```vue
<script setup lang="ts">
import { DtBadge } from '@/components/ui/badge'
import { DtCard, DtCardHeader, DtCardContent } from '@/components/ui/card'

const services = [
  { name: 'API Server', status: 'success' as const, label: 'Operational' },
  { name: 'Database', status: 'warning' as const, label: 'Degraded' },
  { name: 'CDN', status: 'destructive' as const, label: 'Down' },
]
</script>

<template>
  <DtCard>
    <DtCardHeader>
      <h3>Service Status</h3>
    </DtCardHeader>
    <DtCardContent>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div
          v-for="service in services"
          :key="service.name"
          style="display: flex; align-items: center; justify-content: space-between;"
        >
          <span>{{ service.name }}</span>
          <DtBadge :variant="service.status" :dot="true" size="sm">
            {{ service.label }}
          </DtBadge>
        </div>
      </div>
    </DtCardContent>
  </DtCard>
</template>
```

## CSS Custom Properties

### Colors

| Property | Usage |
| ---------- | ------- |
| `--dt-color-accent` | Default variant background. |
| `--dt-color-accent-foreground` | Default variant text. |
| `--dt-color-secondary` | Secondary variant background. |
| `--dt-color-secondary-foreground` | Secondary variant text. |
| `--dt-color-text` | Outline variant text. |
| `--dt-color-border` | Outline variant border. |
| `--dt-color-error` | Destructive variant background. |
| `--dt-color-error-foreground` | Destructive variant text. |
| `--dt-color-success` | Success variant background. |
| `--dt-color-success-foreground` | Success variant text. |
| `--dt-color-warning` | Warning variant background. |
| `--dt-color-warning-foreground` | Warning variant text. |

### Layout & Typography

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-xs` | Gap between the dot and the text. |
| `--dt-radius-full` | Pill-shaped border-radius (9999px). Also used for the dot circle. |
| `--dt-text-body-xs` | Font size at `sm` size. |
| `--dt-text-body-sm` | Font size at `default` size. |
| `--dt-transition-base` | Duration/easing for background-color and color transitions. |

## Accessibility

- DtBadge renders a `<span>`, which is inline and does not convey any semantic meaning by default. If the badge represents a status that is important for the user to understand, pair it with visible text or provide an `aria-label` on a parent element.
- The dot element is marked with `aria-hidden="true"` because it is purely decorative; its meaning should be conveyed by the badge text.
- Color alone should not be the only way to communicate status. Always include descriptive text inside the badge (e.g., "Active" instead of just a green dot).
- When using badges inside interactive elements (such as a table row), ensure the badge text is included in the accessible name or description of that element so screen reader users understand the status.
- Verify that variant foreground/background combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for the badge text).
