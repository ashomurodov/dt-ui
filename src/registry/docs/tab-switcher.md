# DtTabSwitcher

An animated tab bar component with a sliding indicator that uses the FLIP animation technique for smooth, GPU-accelerated transitions. Designed for status filtering in list views but works for any tab-based UI. Supports optional badge counts per tab.

The bar is fully responsive: when the tabs are wider than their container it scrolls horizontally instead of clipping. Selecting a tab smoothly scrolls it into view and reveals about half of the neighbouring tab on the side it scrolls toward, so it's always clear there's more to scroll. Manual scrolling is never overridden — a tab is only auto-scrolled when it isn't already comfortably in view.

## Import

```ts
import { DtTabSwitcher } from '@/components/ui/tab-switcher'
import type { DtTab } from '@/components/ui/tab-switcher'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `tabs` | `DtTab[]` | **required** | Array of tab definitions. |
| `modelValue` | `string` | **required** | The `key` of the currently active tab. Use with `v-model`. |

### DtTab Interface

```ts
interface DtTab {
  key: string       // Unique identifier
  label: string     // Display text
  badge?: string    // Optional badge (e.g., count) shown after the label
}
```

## Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `string` | Emitted when a tab is clicked. |

## Usage Examples

### Status Filter Tabs

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { DtTabSwitcher } from '@/components/ui/tab-switcher'
import type { DtTab } from '@/components/ui/tab-switcher'

const activeTab = ref('all')

const tabs = computed<DtTab[]>(() => [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Published' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'moderation', label: 'In moderation' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'blocked', label: 'Blocked' },
])
</script>

<template>
  <DtTabSwitcher v-model="activeTab" :tabs="tabs" />
</template>
```

### Tabs with Badge

```vue
<script setup lang="ts">
const tabs = [
  { key: 'inbox', label: 'Inbox', badge: '12' },
  { key: 'sent', label: 'Sent' },
  { key: 'drafts', label: 'Drafts', badge: '3' },
]
</script>

<template>
  <DtTabSwitcher v-model="activeTab" :tabs="tabs" />
</template>
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background-tertiary` | Tab bar background. |
| `--dt-color-text` | Active indicator background, and inactive tab hover text color. |
| `--dt-color-text-secondary` | Inactive tab text color. |
| `--dt-color-background` | Active tab text color. |
| `--dt-color-ring` | Keyboard focus ring. |
| `--dt-color-error-light` | Badge background (inactive). |
| `--dt-color-error` | Badge text color (inactive) and badge background (active). |
| `--dt-radius-md` | Tab bar border-radius (12px). |
| `--dt-radius-sm` | Indicator, tab pill, and scroll-track border-radius (8px). |
| `--dt-radius-xs` | Badge border-radius (6px). |
| `--dt-text-body-sm` | Tab text font size (14px). |
| `--dt-transition-fast` | Tab text color transition. |

## Animation Details

The indicator uses the **FLIP technique** (First, Last, Invert, Play):

1. Reads the current visual position via `getBoundingClientRect()` (works even mid-transition), converted into the scroll track's layout coordinate space so the math stays correct while the bar is scrolled.
2. Snaps the indicator to the new target position instantly.
3. Applies a `transform: translateX() scaleX()` to make it appear at the old position.
4. Animates `transform` back to identity — this runs entirely on the GPU compositor.
5. Uses `cubic-bezier(0.4, 0, 0.2, 1)` easing over 300ms.

Because the indicator lives inside the scroll track, it stays glued to its tab while the bar scrolls — the two motions compose without flicker.

## Responsive Scrolling

- **Overflow** — the inner track (`overflow-x: auto`) scrolls horizontally when the tabs exceed the container width; each tab keeps its size rather than shrinking.
- **Scroll into view with peek** — selecting a tab (by click, keyboard focus, or programmatic `v-model` change) smoothly scrolls it fully into view and reveals ~half of the neighbouring tab on the side it scrolled toward. Tabs already in view aren't touched.
- **Edge fades** — the leading/trailing edge fades out while there's more content to scroll in that direction, hinting at the overflow. The scrollbar itself is hidden.
- **Reduced motion** — respects `prefers-reduced-motion: reduce`: indicator and scroll snaps become instant.
- **Resize** — a `ResizeObserver` re-syncs the indicator and overflow state on container resize (e.g., window resize, sidebar toggle).
