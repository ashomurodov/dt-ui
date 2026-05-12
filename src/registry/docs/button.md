# DtButton

A clickable button component with four variants, eight sizes, and loading + disabled states. Renders a native `<button>` element and forwards all attributes via `$attrs`, so native events like `click`, `focus`, and `blur` work without any special binding.

## Import

```ts
import { DtButton } from '@/components/ui/button'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `variant` | `ButtonVariant` | `'default'` | Visual style of the button. |
| `size` | `ButtonSize` | `'md'` | Controls height, padding, radius, and font size. |
| `disabled` | `boolean` | `false` | Disables the button (sets native `disabled` attribute). |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction. The native `disabled` attribute is also set while loading. |

### Type Reference

```ts
type ButtonVariant = 'default' | 'outline' | 'transparent' | 'secondary-grey'
type ButtonSize = '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs'
```

### Variant Behavior

| Variant | Background | Text | Border | Notes |
| --------- | ----------- | ------ | -------- | ------- |
| `default` | `--dt-color-accent` | `--dt-color-white` | same as bg | Primary call-to-action. |
| `outline` | `--dt-color-background` | `--dt-gray-800` | `--dt-color-border` | Neutral bordered button. Active state shifts to accent. |
| `transparent` | transparent | `--dt-color-accent` | none | No background until hover; hover fills `--dt-brand-100`. |
| `secondary-grey` | `--dt-gray-500` | `--dt-color-white` | same as bg | Lower-emphasis solid alternative to `default`. |

### Size Reference

| Size | Height | Padding-x | Border Radius | Font Size | Icon |
| ------ | -------- | ----------- | --------------- | ----------- | ------ |
| `3xl` | 60px | `--dt-spacing-4xl` (32px) | `--dt-radius-xl` (20px) | `--dt-text-body-md` | 20px |
| `2xl` | 56px | `--dt-spacing-3xl` (24px) | `--dt-radius-lg` (16px) | `--dt-text-body-md` | 20px |
| `xl` | 48px | `--dt-spacing-3xl` (24px) | `--dt-radius-lg` (16px) | `--dt-text-body-md` | 20px |
| `lg` | 44px | `--dt-spacing-2xl` (20px) | `--dt-radius-md` (12px) | `--dt-text-body-md` | 20px |
| `md` | 40px | `--dt-spacing-2xl` (20px) | `--dt-radius-md` (12px) | `--dt-text-body-sm` | 16px |
| `sm` | 36px | `--dt-spacing-xl` (16px) | `--dt-radius-md` (12px) | `--dt-text-body-sm` | 16px |
| `xs` | 32px | `--dt-spacing-xl` (16px) | `--dt-radius-sm` (8px) | `--dt-text-body-sm` | 16px |
| `2xs` | 24px | `--dt-spacing-lg` (12px) | `--dt-radius-xs` (6px) | `--dt-text-body-xs` | 14px |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Button label text or content. |
| `icon-left` | Icon rendered before the label. Wrapped in a flex-aligned, fixed-size container per the size scale. |
| `icon-right` | Icon rendered after the label. Wrapped in a flex-aligned, fixed-size container per the size scale. |

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
    <DtButton variant="default">Default</DtButton>
    <DtButton variant="outline">Outline</DtButton>
    <DtButton variant="transparent">Transparent</DtButton>
    <DtButton variant="secondary-grey">Secondary Grey</DtButton>
  </div>

  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
    <DtButton size="3xl">3XL</DtButton>
    <DtButton size="2xl">2XL</DtButton>
    <DtButton size="xl">XL</DtButton>
    <DtButton size="lg">LG</DtButton>
    <DtButton size="md">MD</DtButton>
    <DtButton size="sm">SM</DtButton>
    <DtButton size="xs">XS</DtButton>
    <DtButton size="2xs">2XS</DtButton>
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
| `--dt-color-accent` | Default variant background; transparent variant text. |
| `--dt-color-accent-hover` | Default variant hover background. |
| `--dt-color-accent-active` | Default variant active background. |
| `--dt-color-white` | Default and secondary-grey variant text. |
| `--dt-gray-500` | Secondary-grey background and border. |
| `--dt-gray-700` | Secondary-grey hover background and border. |
| `--dt-gray-600` | Secondary-grey active background and border. |
| `--dt-gray-800` | Outline variant text. |
| `--dt-color-background` | Outline variant background. |
| `--dt-color-background-secondary` | Outline variant hover background. |
| `--dt-color-border` | Outline variant border. |
| `--dt-color-border-hover` | Outline variant hover border. |
| `--dt-brand-100` | Outline active and transparent hover background. |
| `--dt-color-disabled-bg` | Disabled background and border. |
| `--dt-color-disabled-text` | Disabled text. |
| `--dt-color-ring` | Focus-visible outer ring color. |

### Layout & Typography

| Property | Usage |
| ---------- | ------- |
| `--dt-spacing-md` | Default gap between icon slots and label (4px for `2xs`). |
| `--dt-spacing-lg` … `--dt-spacing-4xl` | Per-size horizontal padding. |
| `--dt-radius-xs` … `--dt-radius-xl` | Per-size border radius. |
| `--dt-radius-full` | Spinner border-radius. |
| `--dt-text-body-xs` / `--dt-text-body-sm` / `--dt-text-body-md` | Per-size font size. |
| `--dt-leading-body-xs` / `--dt-leading-body-sm` / `--dt-leading-body-md` | Per-size line height. |
| `--dt-font-medium` | Button font weight. |
| `--dt-transition-base` | Duration/easing for background, border, and color transitions. |

## Accessibility

- Uses a native `<button>` element, so it is keyboard-focusable and activatable with Enter/Space by default.
- The `disabled` attribute is set natively when `disabled` or `loading` is true, which removes the button from the tab order and prevents activation.
- A visible `:focus-visible` ring is drawn as a 2px outer ring at `--dt-color-ring`, offset 5px outside the button, with radius one step larger than the button itself.
- The loading spinner is marked `aria-hidden="true"` to avoid screen readers announcing decorative content.
- When using an icon-only button (no visible text label), pass an `aria-label` attribute to give the button an accessible name.
- Color contrast for all variant/foreground combinations should be verified against WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
