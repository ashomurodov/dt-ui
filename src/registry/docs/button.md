# DtButton

A clickable button component with multiple visual variants, sizes, and support for loading and disabled states. Renders a native `<button>` element and forwards all attributes via `$attrs`, so native events like `click`, `focus`, and `blur` work without any special binding.

## Import

```ts
import { DtButton } from '@/components/ui/button'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `ButtonVariant` | `'primary'` | Visual style of the button. |
| `size` | `ButtonSize` | `'md'` | Controls height, padding, and font size. |
| `disabled` | `boolean` | `false` | Disables the button (sets native `disabled` attribute). |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction. The native `disabled` attribute is also set while loading. |

### Type Reference

```ts
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'
```

### Variant Behavior

| Variant | Background | Text Color | Border | Notes |
| --------- | ----------- | ------------ | -------- | ------- |
| `primary` | `--dt-color-accent` | `--dt-color-accent-foreground` | transparent | Primary call-to-action. |
| `secondary` | `--dt-color-secondary` | `--dt-color-secondary-foreground` | transparent | Lower emphasis. |
| `outline` | `--dt-color-background` | `--dt-gray-800` | `--dt-color-border` | Bordered, light fill. Hover/active uses brand color. |
| `ghost` | transparent | `--dt-gray-800` | none | No background until hover; hover uses `--dt-brand-100`. |

### Size Reference

| Size | Height | Padding | Border Radius | Font Size |
| ------ | -------- | --------- | --------------- | ----------- |
| `xl` | 56px | 18px 24px | `--dt-radius-xl` (20px) | `--dt-text-body-md` |
| `lg` | 48px | 16px 24px | `--dt-radius-lg` (16px) | `--dt-text-body-sm` |
| `md` | 40px | 12px 18px | `--dt-radius-md` (12px) | `--dt-text-body-sm` |
| `sm` | 32px | 8px 16px | `--dt-radius-sm` (8px) | `--dt-text-body-xs` |
| `xs` | 24px | 4px 8px | `--dt-radius-xs` (6px) | `--dt-text-body-xs` |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Button label text or content. |
| `icon-left` | Icon rendered before the label. Wrapped in a flex-aligned container. |
| `icon-right` | Icon rendered after the label. Wrapped in a flex-aligned container. |

## Events

DtButton does not define custom events. All native `<button>` events are forwarded through `v-bind="$attrs"`:

- `click` — Fired on click. Not fired when `disabled` or `loading` is true (native `disabled` prevents it).
- `focus` — Fired when the button receives focus.
- `blur` — Fired when focus leaves the button.

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
    <DtButton variant="primary">Primary</DtButton>
    <DtButton variant="secondary">Secondary</DtButton>
    <DtButton variant="outline">Outline</DtButton>
    <DtButton variant="ghost">Ghost</DtButton>
  </div>

  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
    <DtButton size="xs">Extra Small</DtButton>
    <DtButton size="sm">Small</DtButton>
    <DtButton size="md">Medium</DtButton>
    <DtButton size="lg">Large</DtButton>
    <DtButton size="xl">Extra Large</DtButton>
  </div>
</template>
```

### Loading State with Icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { DtButton } from '@/components/ui/button'

const saving = ref(false)

async function save() {
  saving.value = true
  await new Promise(r => setTimeout(r, 2000))
  saving.value = false
}
</script>

<template>
  <DtButton variant="outline" :disabled="saving">Cancel</DtButton>
  <DtButton :loading="saving" @click="save">
    <template #icon-left>
      <Plus :size="18" />
    </template>
    Save
  </DtButton>
</template>
```

## CSS Custom Properties

The following design tokens are used by DtButton and can be overridden to theme the component:

### Colors

| Property | Usage |
| ---------- | ------- |
| `--dt-color-accent` | Primary variant background. |
| `--dt-color-accent-hover` | Primary variant hover background. |
| `--dt-color-accent-active` | Primary variant active background. |
| `--dt-color-accent-foreground` | Primary variant text. |
| `--dt-color-secondary` | Secondary variant background. |
| `--dt-color-secondary-hover` | Secondary variant hover background. |
| `--dt-color-secondary-active` | Secondary variant active background. |
| `--dt-color-secondary-foreground` | Secondary variant text. |
| `--dt-gray-800` | Text for outline and ghost variants. |
| `--dt-color-border` | Outline variant border. |
| `--dt-brand-100` | Outline active and ghost hover background. |
| `--dt-color-disabled-bg` | Disabled background. |
| `--dt-color-disabled-text` | Disabled text. |
| `--dt-color-ring` | Focus-visible outline color. |

### Layout & Typography

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-md` | Gap between icon slots and label. |
| `--dt-radius-xxs` … `--dt-radius-xl` | Per-size border radius. |
| `--dt-radius-full` | Spinner border-radius. |
| `--dt-text-body-xs` / `--dt-text-body-sm` / `--dt-text-body-md` | Per-size font size. |
| `--dt-font-medium` | Button font weight. |
| `--dt-transition-base` | Duration/easing for background, border, and color transitions. |

## Accessibility

- Uses a native `<button>` element, so it is keyboard-focusable and activatable with Enter/Space by default.
- The `disabled` attribute is set natively when `disabled` or `loading` is true, which removes the button from the tab order and prevents activation.
- A visible `:focus-visible` ring (2px solid `--dt-color-ring`, 2px offset) is applied for keyboard focus, with no outline on mouse click.
- The loading spinner is marked `aria-hidden="true"` to avoid screen readers announcing decorative content.
- When using an icon-only button (no visible text label), pass an `aria-label` attribute to give the button an accessible name.
- Color contrast for all variant/foreground combinations should be verified against WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
