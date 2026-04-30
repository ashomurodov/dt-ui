# DtDialog

A Reka UI backed modal dialog with DT styling. It keeps the existing compound API (`DtDialog`, `DtDialogTrigger`, `DtDialogContent`, `DtDialogHeader`, `DtDialogFooter`) while delegating modal behavior, focus trapping, Escape dismissal, outside interaction handling, scroll locking, and screen-reader hiding to `reka-ui`.

## Dependency

This component imports primitives from `reka-ui`. The `dt-ui` CLI installs `reka-ui@2.9.6` when you run:

```bash
npx dt-ui add dialog
```

`dialog` still depends on `button` internally for the examples and common usage patterns.

## Import

```ts
import {
  DtDialog,
  DtDialogTrigger,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtDialog,
  DtDialogTrigger,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'

const open = ref(false)
</script>

<template>
  <DtDialog v-model="open">
    <DtDialogTrigger>
      <DtButton>Open Dialog</DtButton>
    </DtDialogTrigger>

    <DtDialogContent>
      <DtDialogHeader>
        <h2>Confirm Action</h2>
        <p>Are you sure you want to continue?</p>
      </DtDialogHeader>

      <DtDialogFooter>
        <DtButton variant="outline" @click="open = false">Cancel</DtButton>
        <DtButton @click="open = false">Confirm</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

## DtDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `undefined` | Controlled open state. Use with `v-model`. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled open state. |
| `modal` | `boolean` | `true` | Whether outside content should be inert while open. |

## Slot Props

The default slot receives helpers for custom triggers or programmatic control.

| Slot Prop | Type | Description |
|-----------|------|-------------|
| `open` | `boolean` | Current open state. |
| `toggle` | `() => void` | Toggles the dialog. |
| `close` | `() => void` | Closes the dialog. |
| `openDialog` | `() => void` | Opens the dialog. |

## DtDialogTrigger

Wraps Reka `DialogTrigger`. By default `asChild` is `true`, which lets common usage like `<DtDialogTrigger><DtButton>Open</DtButton></DtDialogTrigger>` merge trigger behavior directly onto the button and avoid nested buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Merge trigger behavior into the slotted child. Set to `false` to render a native trigger button. |

## DtDialogContent

Renders a Reka `DialogPortal`, `DialogOverlay`, and `DialogContent`. The content is centered with DT styling and animated using Reka's `data-state` attributes.

## DtDialogHeader and DtDialogFooter

These remain visual layout helpers. Use heading and paragraph content in the header, and action buttons in the footer.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when open state changes. |

## Accessibility

Reka UI provides `role="dialog"`, `aria-modal`, focus trapping, Escape key handling, outside click dismissal, body scroll lock through the overlay, and focus restoration to the trigger. For best screen-reader announcements, provide a clear heading in `DtDialogHeader`; future versions may expose dedicated `DtDialogTitle` and `DtDialogDescription` wrappers if teams need stricter title/description wiring.
