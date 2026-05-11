# DtCard

A container component for grouping related content into a visually distinct section. Uses a compound component pattern with `DtCardHeader`, `DtCardContent`, and `DtCardFooter` sub-components that can be composed freely inside `DtCard`.

## Import

```ts
import { DtCard, DtCardHeader, DtCardContent, DtCardFooter } from '@/components/ui/card'
```

## Components

### DtCard

The root container. Renders a `<div>` with background, border-radius, and optional border, shadow, and padding.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `bordered` | `boolean` | `true` | Adds a 1px solid border using `--dt-color-border`. |
| `shadow` | `boolean` | `false` | Applies a medium box-shadow (`--dt-shadow-md`). |
| `padding` | `boolean` | `true` | Applies `--dt-spacing-3xl` (1.5rem) padding to the card. |

#### Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Card body content. Typically contains `DtCardHeader`, `DtCardContent`, and `DtCardFooter` sub-components but can hold any content. |

### DtCardHeader

A header section that renders a flex column with a small gap. Applies default styles to heading elements (`h1`-`h4`: bold, tight line-height) and paragraphs (`p`: muted color, small font size) via `:deep()` selectors.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Header content. Typically a heading and an optional description paragraph. |

### DtCardContent

A simple body wrapper. Applies base font size and foreground color.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Main card body content. |

### DtCardFooter

A footer section with horizontal flex layout and gap for action elements.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Footer content. Typically buttons or links. |

## Events

None of the card components emit custom events. Native events are forwarded through `$attrs` on each root element.

## Usage Examples

### Basic Card

```vue
<script setup lang="ts">
import { DtCard, DtCardHeader, DtCardContent } from '@/components/ui/card'
</script>

<template>
  <DtCard>
    <DtCardHeader>
      <h3>Notifications</h3>
      <p>You have 3 unread messages.</p>
    </DtCardHeader>
    <DtCardContent>
      <p>Your recent activity will appear here.</p>
    </DtCardContent>
  </DtCard>
</template>
```

### Card Variants (shadow, no border, no padding)

```vue
<script setup lang="ts">
import { DtCard, DtCardHeader, DtCardContent } from '@/components/ui/card'
</script>

<template>
  <!-- Elevated card with shadow, no border -->
  <DtCard :bordered="false" :shadow="true">
    <DtCardHeader>
      <h3>Elevated Card</h3>
    </DtCardHeader>
    <DtCardContent>
      <p>This card uses a shadow instead of a border for visual separation.</p>
    </DtCardContent>
  </DtCard>

  <!-- Minimal card, no padding -->
  <DtCard :padding="false">
    <img src="/banner.jpg" alt="Banner" style="width: 100%;" />
    <div style="padding: 1.5rem;">
      <h3>Full-bleed Image</h3>
      <p>Removing padding lets content like images extend to the edges.</p>
    </div>
  </DtCard>
</template>
```

### Composed with DtButton and DtBadge

```vue
<script setup lang="ts">
import { DtCard, DtCardHeader, DtCardContent, DtCardFooter } from '@/components/ui/card'
import { DtButton } from '@/components/ui/button'
import { DtBadge } from '@/components/ui/badge'
</script>

<template>
  <DtCard :shadow="true" style="max-width: 24rem;">
    <DtCardHeader>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h3>Pro Plan</h3>
        <DtBadge variant="success">Active</DtBadge>
      </div>
      <p>Your subscription renews on April 1, 2026.</p>
    </DtCardHeader>
    <DtCardContent>
      <p>50 GB storage, unlimited collaborators, priority support.</p>
    </DtCardContent>
    <DtCardFooter>
      <DtButton variant="outline">Manage</DtButton>
      <DtButton variant="destructive">Cancel Plan</DtButton>
    </DtCardFooter>
  </DtCard>
</template>
```

## CSS Custom Properties

### DtCard

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background` | Card background color. |
| `--dt-color-border` | Border color (when `bordered` is true). |
| `--dt-radius-lg` | Card border-radius. |
| `--dt-shadow-md` | Box-shadow (when `shadow` is true). |
| `--dt-spacing-3xl` | Padding (when `padding` is true). |

### DtCardHeader

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-xs` | Vertical gap between heading and description. |
| `--dt-spacing-xl` | Bottom padding separating the header from subsequent content. |
| `--dt-color-text` | Heading text color. |
| `--dt-color-text-secondary` | Description paragraph text color. |
| `--dt-text-body-sm` | Description paragraph font size. |

### DtCardContent

| Property | Usage |
| ---------- | ------- |
| `--dt-color-text` | Text color. |
| `--dt-text-body-md` | Font size. |

### DtCardFooter

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-md` | Horizontal gap between footer items. |
| `--dt-spacing-xl` | Top padding separating the footer from preceding content. |

## Accessibility

- DtCard renders a plain `<div>`, which is semantically neutral. If the card represents a distinct section of the page, consider adding `role="region"` and an `aria-labelledby` attribute pointing to the heading id inside `DtCardHeader`.
- All sub-components forward `$attrs`, so you can add any ARIA attributes directly (e.g., `aria-label`, `role`).
- Heading levels inside `DtCardHeader` should follow the document outline. Do not skip heading levels (e.g., jumping from `h2` to `h4`).
- The card uses `overflow: hidden`, which clips content visually. Ensure interactive elements near the edges are not accidentally clipped or made unreachable.
- When cards are used in a list or grid, consider wrapping them in a `<ul>` / `<li>` structure or adding `role="list"` / `role="listitem"` for better screen reader navigation.
