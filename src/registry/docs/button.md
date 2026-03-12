# DtButton

A clickable button component with multiple visual variants, sizes, and support for loading and disabled states. Renders a native `<button>` element and forwards all attributes via `$attrs`, so native events like `click`, `focus`, and `blur` work without any special binding.

## Import

```ts
import { DtButton } from '@/components/ui/button'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'default'` | Visual style of the button. |
| `size` | `ButtonSize` | `'default'` | Controls height, padding, and font size. |
| `disabled` | `boolean` | `false` | Disables the button (sets native `disabled` attribute and reduces opacity). |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction. The native `disabled` attribute is also set while loading. |

### Type Reference

```ts
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'
```

### Variant Behavior

| Variant | Background | Text Color | Border | Notes |
|---------|-----------|------------|--------|-------|
| `default` | `--dt-primary` | `--dt-primary-foreground` | transparent | Primary call-to-action. |
| `secondary` | `--dt-secondary` | `--dt-secondary-foreground` | transparent | Lower emphasis. |
| `outline` | transparent | `--dt-foreground` | `--dt-border` | Bordered, no fill. |
| `ghost` | transparent | `--dt-foreground` | none | No background until hover. |
| `destructive` | `--dt-destructive` | `--dt-destructive-foreground` | transparent | Dangerous actions (delete, remove). |
| `link` | transparent | `--dt-primary` | none | Underlined text, link-like appearance. |

### Size Reference

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 2rem (32px) | 0 0.75rem | `--dt-font-size-sm` |
| `default` | 2.5rem (40px) | 0 1rem | `--dt-font-size-base` |
| `lg` | 2.75rem (44px) | 0 1.5rem | `--dt-font-size-lg` |
| `icon` | 2.5rem (40px) | 0 (square) | inherited |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Button label text or content. |
| `icon-left` | Icon rendered before the label. Wrapped in a flex-aligned container. |
| `icon-right` | Icon rendered after the label. Wrapped in a flex-aligned container. |

## Events

DtButton does not define custom events. All native `<button>` events are forwarded through `v-bind="$attrs"`:

- `click` -- Fired on click. Not fired when `disabled` or `loading` is true (native `disabled` prevents it).
- `focus` -- Fired when the button receives focus.
- `blur` -- Fired when focus leaves the button.

## Usage Examples

### Basic Button

```vue
<script setup lang="ts">
import { DtButton } from '@/components/ui/button'

function handleClick() {
  console.log('clicked')
}
</script>

<template>
  <DtButton @click="handleClick">Save Changes</DtButton>
</template>
```

### Button Variants and Sizes

```vue
<script setup lang="ts">
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <div style="display: flex; gap: 0.5rem; align-items: center;">
    <DtButton variant="default">Primary</DtButton>
    <DtButton variant="secondary">Secondary</DtButton>
    <DtButton variant="outline">Outline</DtButton>
    <DtButton variant="ghost">Ghost</DtButton>
    <DtButton variant="destructive">Delete</DtButton>
    <DtButton variant="link">Learn More</DtButton>
  </div>

  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
    <DtButton size="sm">Small</DtButton>
    <DtButton size="default">Default</DtButton>
    <DtButton size="lg">Large</DtButton>
    <DtButton size="icon" aria-label="Settings">
      <svg width="16" height="16" viewBox="0 0 16 16"><path d="..." /></svg>
    </DtButton>
  </div>
</template>
```

### Loading State with Icons (composed with DtCard)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtButton } from '@/components/ui/button'
import { DtCard, DtCardFooter } from '@/components/ui/card'

const saving = ref(false)

async function save() {
  saving.value = true
  await new Promise(r => setTimeout(r, 2000))
  saving.value = false
}
</script>

<template>
  <DtCard>
    <p>Document contents go here.</p>
    <DtCardFooter>
      <DtButton variant="outline" :disabled="saving">Cancel</DtButton>
      <DtButton :loading="saving" @click="save">
        <template #icon-left>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="..." /></svg>
        </template>
        Save
      </DtButton>
    </DtCardFooter>
  </DtCard>
</template>
```

## CSS Custom Properties

The following design tokens are used by DtButton and can be overridden to theme the component:

### Colors

| Property | Usage |
|----------|-------|
| `--dt-primary` | Default variant background. |
| `--dt-primary-hover` | Default variant hover background. |
| `--dt-primary-foreground` | Default variant text. |
| `--dt-secondary` | Secondary variant background. |
| `--dt-secondary-hover` | Secondary variant hover background. |
| `--dt-secondary-foreground` | Secondary variant text. |
| `--dt-foreground` | Text for outline and ghost variants. |
| `--dt-accent` | Hover background for outline and ghost variants. |
| `--dt-border` | Outline variant border. |
| `--dt-border-hover` | Outline variant hover border. |
| `--dt-destructive` | Destructive variant background. |
| `--dt-destructive-hover` | Destructive variant hover background. |
| `--dt-destructive-foreground` | Destructive variant text. |
| `--dt-ring` | Focus-visible outline color. |

### Layout & Typography

| Property | Usage |
|----------|-------|
| `--dt-space-2` | Gap between icon slots and label. |
| `--dt-radius-md` | Button border-radius. |
| `--dt-radius-full` | Spinner border-radius. |
| `--dt-font-size-sm` | Font size at `sm` size. |
| `--dt-font-size-base` | Font size at `default` size. |
| `--dt-font-size-lg` | Font size at `lg` size. |
| `--dt-transition-base` | Duration/easing for background, border, color, and box-shadow transitions. |

## Accessibility

- Uses a native `<button>` element, so it is keyboard-focusable and activatable with Enter/Space by default.
- The `disabled` attribute is set natively when `disabled` or `loading` is true, which removes the button from the tab order and prevents activation.
- A visible `:focus-visible` ring (2px solid `--dt-ring`, 2px offset) is applied for keyboard focus, with no outline on mouse click.
- The loading spinner is marked `aria-hidden="true"` to avoid screen readers announcing decorative content.
- When using `size="icon"` (no visible text label), you must provide an `aria-label` attribute to give the button an accessible name.
- Color contrast for all variant/foreground combinations should be verified against WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
