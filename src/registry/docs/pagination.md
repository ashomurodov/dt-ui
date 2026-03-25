# DtPagination

Page navigation with prev/next arrows and numbered page buttons. Supports two visual hierarchies (primary/secondary) and 3 sizes from the Figma design system. Shows a sliding window of up to 3 page numbers. Automatically hides on single page.

## Import

```ts
import { DtPagination } from '@/components/ui/pagination'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | **required** | Current active page (1-based). Use with `v-model:page`. |
| `totalCount` | `number` | **required** | Total number of items across all pages. |
| `pageSize` | `number` | `10` | Number of items per page. |
| `variant` | `'primary' \| 'secondary'` | `'secondary'` | Visual hierarchy. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Button size. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | Emitted when a page button or arrow is clicked. |

## Variants (Figma)

### Secondary (default)
- Bordered buttons (`--dt-color-border`)
- Active: dark fill (`--dt-gray-800`), white text
- Hover: gray background (`--dt-gray-100`)
- Disabled: gray fill, muted text

### Primary
- No border
- Active: accent fill (`--dt-color-accent`), white text
- Hover: gray background
- Disabled: gray fill, muted text

## Sizes (Figma)

| Size | Height | Border Radius |
|------|--------|---------------|
| `lg` | 40px | 8px |
| `md` | 36px | 8px |
| `sm` | 32px | 4px |

## Usage

```vue
<!-- Secondary (bordered, dark active) — default -->
<DtPagination v-model:page="page" :total-count="totalCount" />

<!-- Primary (accent active) -->
<DtPagination v-model:page="page" :total-count="totalCount" variant="primary" />

<!-- Small size -->
<DtPagination v-model:page="page" :total-count="totalCount" size="sm" />

<!-- Large, primary -->
<DtPagination v-model:page="page" :total-count="totalCount" variant="primary" size="lg" />
```

## CSS Custom Properties

| Property | Usage |
|----------|-------|
| `--dt-gray-100` | Hover and disabled background. |
| `--dt-gray-300` | Disabled text color. |
| `--dt-gray-500` | Default text/icon color. |
| `--dt-gray-800` | Hover text, secondary active fill. |
| `--dt-color-accent` | Primary active fill. |
| `--dt-color-background` | Button default background. |
| `--dt-color-border` | Secondary button border. |
| `--dt-radius-md` | LG/MD button radius (8px). |
| `--dt-radius-xs` | SM button radius (4px). |
| `--dt-text-sm` | Page number font size. |
| `--dt-space-6` | Top margin. |
