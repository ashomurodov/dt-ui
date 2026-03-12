# Dialog

Modal dialog with overlay, header, content, and footer.

```bash
npx dt-ui add dialog
```

::: info
Dialog depends on the **button** component. The CLI will prompt you to install it.
:::

## Usage

```vue
<script setup lang="ts">
import { DtDialog, DtDialogTrigger, DtDialogContent, DtDialogHeader, DtDialogFooter } from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <DtDialog v-model="open">
    <DtDialogTrigger>
      <DtButton>Open Dialog</DtButton>
    </DtDialogTrigger>
    <DtDialogContent>
      <DtDialogHeader>
        <h3>Confirm Action</h3>
        <p>Are you sure you want to proceed?</p>
      </DtDialogHeader>
      <DtDialogFooter>
        <DtButton variant="outline" @click="open = false">Cancel</DtButton>
        <DtButton @click="open = false">Confirm</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

## Features

- Overlay backdrop with click-outside to close
- Focus trapping within the dialog
- Escape key to close
- Body scroll lock when open
- Entrance/exit animations
- Teleports to `<body>`

## DtDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `undefined` | Open state (v-model) |

## Sub-components

| Component | Description |
|-----------|-------------|
| `DtDialogTrigger` | Wraps the trigger element, toggles dialog on click |
| `DtDialogContent` | The modal panel (rendered via Teleport) |
| `DtDialogHeader` | Header section with title/description styling |
| `DtDialogFooter` | Footer with flex layout for action buttons |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when open state changes |

## Accessibility

- `role="dialog"` and `aria-modal="true"` on content
- Focus is trapped within the dialog when open
- Focus returns to trigger element on close
