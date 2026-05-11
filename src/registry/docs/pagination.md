# DtPagination

Page navigation with prev/next arrows, numbered page buttons, and smart ellipsis. Supports two visual hierarchies (primary/secondary) and 3 sizes from the Figma design system. Shows a stable 5-page window with first/last page always visible. Automatically hides on single page.

## Import

```ts
import { DtPagination } from '@/components/ui/pagination'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `page` | `number` | **required** | Current active page (1-based). Use with `v-model:page`. |
| `totalCount` | `number` | **required** | Total number of items across all pages. |
| `pageSize` | `number` | `10` | Number of items per page. |
| `variant` | `'primary' \| 'secondary'` | `'secondary'` | Visual hierarchy. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Button size. |

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:page` | `number` | Emitted when a page button or arrow is clicked. |

## Page Window Behavior

The pagination shows a stable 5-page window with ellipsis for large page counts:

| Position | Display |
| ---------- | --------- |
| ≤7 total pages | All pages shown, no ellipsis |
| Near start (page 1–4) | **1 2 3 4 5** ... 50 |
| Middle (page 16) | 1 ... 14 15 **16** 17 18 ... 50 |
| Near end (page 47–50) | 1 ... **46 47 48 49 50** |

The first 5 pages remain as a stable block — no pages appear or disappear one by one when clicking through the first few pages.

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
| ------ | -------- | --------------- |
| `lg` | 40px | 8px |
| `md` | 36px | 8px |
| `sm` | 32px | 4px |

## Usage

```vue
<!-- Few pages — all visible -->
<DtPagination v-model:page="page" :total-count="25" />

<!-- Secondary (bordered, dark active) — default -->
<DtPagination v-model:page="page" :total-count="500" />

<!-- Primary (accent active) -->
<DtPagination v-model:page="page" :total-count="500" variant="primary" />

<!-- Small size -->
<DtPagination v-model:page="page" :total-count="500" size="sm" />

<!-- Large, primary -->
<DtPagination v-model:page="page" :total-count="500" variant="primary" size="lg" />
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-gray-100` | Hover and disabled background. |
| `--dt-gray-300` | Disabled text color. |
| `--dt-gray-400` | Ellipsis color. |
| `--dt-gray-500` | Default text/icon color. |
| `--dt-gray-800` | Hover text, secondary active fill. |
| `--dt-color-accent` | Primary active fill. |
| `--dt-color-background` | Button default background. |
| `--dt-color-border` | Secondary button border. |
| `--dt-radius-sm` | LG/MD button radius (8px). |
| `--dt-radius-xxs` | SM button radius (4px). |
| `--dt-text-body-sm` | Page number font size. |
| `--dt-spacing-3xl` | Top margin. |
