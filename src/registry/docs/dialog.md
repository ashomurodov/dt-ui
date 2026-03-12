# DtDialog

A modal dialog overlay that interrupts the user flow to display critical information or request input. Uses a compound component pattern with `DtDialogTrigger`, `DtDialogContent`, `DtDialogHeader`, and `DtDialogFooter`. The dialog content is rendered via `<Teleport to="body">` and includes focus trapping, Escape key dismissal, click-outside-to-close, body scroll lock, and open/close animations. State is shared between sub-components through Vue's `provide`/`inject`.

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

## Components

### DtDialog

The root wrapper. Manages open/close state and provides it to child components via `provide('dt-dialog', ...)`. Renders only a default slot (no DOM element of its own).

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `undefined` | Controls the open state with `v-model`. When not provided, the component manages state internally. |

#### Slot Props

The default slot receives the following props for advanced control:

| Slot Prop | Type | Description |
|-----------|------|-------------|
| `open` | `boolean` | Current open state. |
| `toggle` | `() => void` | Toggles the dialog open/closed. |
| `close` | `() => void` | Closes the dialog. |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when the open state changes. Used by `v-model`. |

### DtDialogTrigger

A wrapper element that toggles the dialog when clicked. Renders a `<span>` around its slot content.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | The trigger element (typically a button). |

### DtDialogContent

The modal panel rendered inside the overlay. Teleported to `<body>`. Handles the overlay backdrop, focus trap, keyboard events, click-outside detection, body scroll lock, and open/close animations.

#### Props

None. Attributes are forwarded via `$attrs` onto the inner `role="dialog"` element.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Dialog body. Typically contains `DtDialogHeader`, free-form content, and `DtDialogFooter`. |

#### Behavior

- **Overlay**: Semi-transparent black backdrop (`rgb(0 0 0 / 0.4)`).
- **Focus trap**: On open, focus moves to the first focusable element inside the dialog. Tab/Shift+Tab cycles within the dialog content.
- **Escape to close**: Pressing `Escape` triggers `close()`.
- **Click outside**: Clicking the overlay (not the content panel) triggers `close()`.
- **Scroll lock**: `document.body.style.overflow` is set to `'hidden'` while open and restored on close.
- **Animation**: The overlay fades in/out (opacity 0 to 1, 0.2s ease). The content panel scales and translates in (`scale(0.95) translateY(0.5rem)` to `scale(1) translateY(0)`, 0.2s ease).
- **Restore focus**: On close, focus returns to the element that was focused before the dialog opened.

### DtDialogHeader

A flex-column container for the dialog title and description. Applies heading and paragraph styles via `:deep()` selectors, identical to `DtCardHeader`.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Header content, typically an `<h2>` and optional `<p>` description. |

### DtDialogFooter

A flex container for dialog actions, right-aligned by default with `justify-content: flex-end`.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Action elements, typically buttons. |

## Usage Examples

### Basic Confirmation Dialog

```vue
<script setup lang="ts">
import {
  DtDialog,
  DtDialogTrigger,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <DtDialog>
    <DtDialogTrigger>
      <DtButton variant="destructive">Delete Account</DtButton>
    </DtDialogTrigger>

    <DtDialogContent>
      <DtDialogHeader>
        <h2>Are you sure?</h2>
        <p>This action cannot be undone. Your account and all associated data will be permanently deleted.</p>
      </DtDialogHeader>
      <DtDialogFooter>
        <DtButton variant="outline">Cancel</DtButton>
        <DtButton variant="destructive">Yes, Delete</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

### Controlled with v-model

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtDialog,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'
import { DtInput } from '@/components/ui/input'

const dialogOpen = ref(false)
const feedback = ref('')

function submit() {
  console.log('Feedback:', feedback.value)
  dialogOpen.value = false
}
</script>

<template>
  <DtButton @click="dialogOpen = true">Give Feedback</DtButton>

  <DtDialog v-model="dialogOpen">
    <DtDialogContent>
      <DtDialogHeader>
        <h2>Send Feedback</h2>
        <p>Let us know how we can improve.</p>
      </DtDialogHeader>

      <DtInput
        v-model="feedback"
        placeholder="Type your feedback..."
      >
        <template #label>Your Message</template>
      </DtInput>

      <DtDialogFooter>
        <DtButton variant="outline" @click="dialogOpen = false">Cancel</DtButton>
        <DtButton @click="submit">Submit</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

### Using Slot Props for Programmatic Control

```vue
<script setup lang="ts">
import {
  DtDialog,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <DtDialog v-slot="{ open, toggle, close }">
    <DtButton @click="toggle">
      {{ open ? 'Close' : 'Open' }} Settings
    </DtButton>

    <DtDialogContent>
      <DtDialogHeader>
        <h2>Settings</h2>
        <p>Manage your preferences.</p>
      </DtDialogHeader>

      <p>Settings content goes here.</p>

      <DtDialogFooter>
        <DtButton variant="outline" @click="close">Cancel</DtButton>
        <DtButton @click="close">Save</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

## CSS Custom Properties

### Overlay

| Property | Usage |
|----------|-------|
| `--dt-z-overlay` | z-index for the overlay backdrop. |
| `--dt-space-4` | Padding inside the overlay (keeps the dialog panel inset from viewport edges). |

### Dialog Content Panel

| Property | Usage |
|----------|-------|
| `--dt-z-modal` | z-index for the dialog content panel (above the overlay). |
| `--dt-background` | Panel background color. |
| `--dt-border` | Panel border color. |
| `--dt-radius-lg` | Panel border-radius. |
| `--dt-shadow-lg` | Panel box-shadow. |
| `--dt-space-6` | Panel inner padding. |

### DtDialogHeader

| Property | Usage |
|----------|-------|
| `--dt-space-1` | Gap between heading and description. |
| `--dt-space-4` | Bottom padding below the header. |
| `--dt-foreground` | Heading text color. |
| `--dt-muted-foreground` | Description paragraph color. |
| `--dt-font-size-lg` | Heading font size. |
| `--dt-font-size-sm` | Description font size. |

### DtDialogFooter

| Property | Usage |
|----------|-------|
| `--dt-space-2` | Gap between footer action buttons. |
| `--dt-space-4` | Top padding above the footer. |

### DtDialogTrigger

No custom properties. Renders as an `inline-flex` span with `cursor: pointer`.

## Accessibility

- The dialog content panel has `role="dialog"` and `aria-modal="true"`, telling assistive technologies that the rest of the page is inert while the dialog is open.
- **Focus management**: When the dialog opens, focus automatically moves to the first focusable element inside `DtDialogContent`. When it closes, focus returns to the element that triggered the dialog (stored in `previousActiveElement`).
- **Focus trap**: Tab and Shift+Tab cycling is confined within the dialog. When focus reaches the last focusable element, Tab wraps to the first, and vice versa.
- **Keyboard dismissal**: Pressing `Escape` closes the dialog.
- **Body scroll lock**: `document.body.style.overflow` is set to `'hidden'` while the dialog is open, preventing background scroll. The overflow style is cleaned up in `onBeforeUnmount` as a safety net.
- For best practices, the `DtDialogHeader` should contain a heading element (e.g., `<h2>`) and you should add `aria-labelledby` on the `DtDialogContent` pointing to that heading's `id`. Similarly, if there is a description paragraph, add `aria-describedby` pointing to that paragraph's `id`.
- Ensure that destructive actions in the dialog footer are not the first focusable element. Place a "Cancel" or neutral action first so keyboard users do not accidentally trigger a destructive action.
