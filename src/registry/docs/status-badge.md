# DtStatusBadge

A color-coded status pill component for displaying entity states like active, inactive, moderation, etc. Uses semantic colors from the design token system — green for active, gray for inactive, orange for moderation, red for rejected/canceled/blocked.

## Import

```ts
import { DtStatusBadge } from '@/components/ui/status-badge'
import type { StatusVariant } from '@/components/ui/status-badge'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `StatusVariant` | **required** | The status type, determining background and text color. |

### StatusVariant Type

```ts
type StatusVariant = 'active' | 'inactive' | 'moderation' | 'canceled' | 'rejected' | 'blocked'
```

### Variant Colors

| Variant | Background | Text Color | Use Case |
|---------|-----------|------------|----------|
| `active` | `--dt-color-success-light` | `--dt-color-success` | Published, approved, enabled |
| `inactive` | `--dt-color-background-tertiary` | `--dt-color-text-tertiary` | Draft, disabled, unpublished |
| `moderation` | `--dt-color-warning-light` | `--dt-color-warning` | Pending review |
| `canceled` | `--dt-color-error-light` | `--dt-color-error` | Canceled by user |
| `rejected` | `--dt-color-error-light` | `--dt-color-error` | Rejected by moderator |
| `blocked` | `--dt-color-error-light` | `--dt-color-error` | Blocked by admin |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Status label text. |

## Usage Examples

### Basic Usage

```vue
<script setup lang="ts">
import { DtStatusBadge } from '@/components/ui/status-badge'
</script>

<template>
  <DtStatusBadge variant="active">Published</DtStatusBadge>
  <DtStatusBadge variant="moderation">In review</DtStatusBadge>
  <DtStatusBadge variant="rejected">Rejected</DtStatusBadge>
</template>
```

### Inside a DataTable

```vue
<template #status="{ item }">
  <DtStatusBadge :variant="statusVariantMap[item.status] ?? 'inactive'">
    {{ statusLabelMap[item.status] ?? 'Pending' }}
  </DtStatusBadge>
</template>
```

### Dynamic Status Mapping Pattern

```ts
const STATUS = { ACTIVE: 1, INACTIVE: 0, MODERATION: 3, REJECTED: 4, BLOCKED: 2 } as const

const statusVariantMap: Record<number, StatusVariant> = {
  [STATUS.ACTIVE]: 'active',
  [STATUS.INACTIVE]: 'inactive',
  [STATUS.MODERATION]: 'moderation',
  [STATUS.REJECTED]: 'rejected',
  [STATUS.BLOCKED]: 'blocked',
}
```

## CSS Custom Properties

| Property | Usage |
|----------|-------|
| `--dt-color-success-light` | Active variant background. |
| `--dt-color-success` | Active variant text. |
| `--dt-color-background-tertiary` | Inactive variant background. |
| `--dt-color-text-tertiary` | Inactive variant text. |
| `--dt-color-warning-light` | Moderation variant background. |
| `--dt-color-warning` | Moderation variant text. |
| `--dt-color-error-light` | Canceled/rejected/blocked variant background. |
| `--dt-color-error` | Canceled/rejected/blocked variant text. |
| `--dt-radius-sm` | Badge border-radius (6px). |
| `--dt-text-xs` | Badge font size (12px). |
