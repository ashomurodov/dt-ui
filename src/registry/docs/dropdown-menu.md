# DtDropdownMenu

A floating menu that opens from any trigger element. Includes items, separators, labels, groups, checkbox/radio items, and nested submenus. Built on Reka UI primitives so positioning, keyboard navigation (arrows, typeahead, Home/End, Esc), focus trapping, outside dismissal, portal rendering, and ARIA roles all come for free.

## Dependency

This component imports primitives from `reka-ui`. The `dt-ui` CLI installs `reka-ui@2.9.6` when you run:

```bash
npx dt-ui add dropdown-menu
```

## Import

```ts
import {
  DtDropdownMenu,
  DtDropdownMenuTrigger,
  DtDropdownMenuContent,
  DtDropdownMenuItem,
  DtDropdownMenuSeparator,
  DtDropdownMenuLabel,
  DtDropdownMenuGroup,
  DtDropdownMenuCheckboxItem,
  DtDropdownMenuRadioGroup,
  DtDropdownMenuRadioItem,
  DtDropdownMenuSub,
  DtDropdownMenuSubTrigger,
  DtDropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
```

## Usage

### Basic

```vue
<script setup lang="ts">
import {
  DtDropdownMenu,
  DtDropdownMenuTrigger,
  DtDropdownMenuContent,
  DtDropdownMenuItem,
  DtDropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
</script>

<template>
  <DtDropdownMenu>
    <DtDropdownMenuTrigger label="Action" />

    <DtDropdownMenuContent>
      <DtDropdownMenuItem @select="copy">Copy</DtDropdownMenuItem>
      <DtDropdownMenuItem @select="paste">Paste</DtDropdownMenuItem>
      <DtDropdownMenuSeparator />
      <DtDropdownMenuItem destructive @select="remove">Delete</DtDropdownMenuItem>
    </DtDropdownMenuContent>
  </DtDropdownMenu>
</template>
```

### Icon-only trigger

```vue
<DtDropdownMenu>
  <DtDropdownMenuTrigger icon-only />
  <DtDropdownMenuContent align="end">
    <DtDropdownMenuItem>Edit</DtDropdownMenuItem>
    <DtDropdownMenuItem>Duplicate</DtDropdownMenuItem>
    <DtDropdownMenuSeparator />
    <DtDropdownMenuItem destructive>Delete</DtDropdownMenuItem>
  </DtDropdownMenuContent>
</DtDropdownMenu>
```

The default icon is a vertical three-dot glyph; pass any 16px SVG via the default slot to override.

### Custom trigger (BYO)

For full control, set `as-child` and slot your own element. `as-child` defers all styling and chevron rendering to your element.

```vue
<DtDropdownMenuTrigger as-child>
  <DtButton variant="outline">Open menu</DtButton>
</DtDropdownMenuTrigger>
```

### Items with leading icon

```vue
<DtDropdownMenuItem>
  <template #leading>
    <IconUser />
  </template>
  Profile
</DtDropdownMenuItem>
```

### Group + label

```vue
<DtDropdownMenuLabel>Account</DtDropdownMenuLabel>
<DtDropdownMenuGroup>
  <DtDropdownMenuItem>Profile</DtDropdownMenuItem>
  <DtDropdownMenuItem>Billing</DtDropdownMenuItem>
  <DtDropdownMenuItem>Settings</DtDropdownMenuItem>
</DtDropdownMenuGroup>
```

### Checkbox items

```vue
<script setup lang="ts">
import { ref } from 'vue'
const showStatusBar = ref(true)
const showFullPath  = ref(false)
</script>

<template>
  <DtDropdownMenuCheckboxItem v-model="showStatusBar">Show status bar</DtDropdownMenuCheckboxItem>
  <DtDropdownMenuCheckboxItem v-model="showFullPath">Show full path</DtDropdownMenuCheckboxItem>
</template>
```

### Radio group

```vue
<script setup lang="ts">
import { ref } from 'vue'
const position = ref('bottom')
</script>

<template>
  <DtDropdownMenuRadioGroup v-model="position">
    <DtDropdownMenuRadioItem value="top">Top</DtDropdownMenuRadioItem>
    <DtDropdownMenuRadioItem value="right">Right</DtDropdownMenuRadioItem>
    <DtDropdownMenuRadioItem value="bottom">Bottom</DtDropdownMenuRadioItem>
  </DtDropdownMenuRadioGroup>
</template>
```

### Nested submenu

```vue
<DtDropdownMenuSub>
  <DtDropdownMenuSubTrigger>Share</DtDropdownMenuSubTrigger>
  <DtDropdownMenuSubContent>
    <DtDropdownMenuItem>Copy link</DtDropdownMenuItem>
    <DtDropdownMenuItem>Email</DtDropdownMenuItem>
    <DtDropdownMenuItem>Twitter</DtDropdownMenuItem>
  </DtDropdownMenuSubContent>
</DtDropdownMenuSub>
```

## DtDropdownMenu Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `undefined` | Controlled open state. Use with `v-model`. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled open state. |
| `modal` | `boolean` | `true` | Whether outside content is inert while open. |

### Slot props

The default slot receives helpers for programmatic control.

| Slot Prop | Type | Description |
| ----------- | ------ | ------------- |
| `open` | `boolean` | Current open state. |
| `toggle` | `() => void` | Toggles the menu. |
| `close` | `() => void` | Closes the menu. |
| `openMenu` | `() => void` | Opens the menu. |

## DtDropdownMenuTrigger

Renders an opinionated button trigger by default — white surface, gray-200 border, `--dt-shadow-xs`, `--dt-radius-sm` (8px), trailing chevron-down that rotates 180° when the menu is open. Pass `icon-only` for a square icon trigger (default glyph: vertical three dots). For full BYO, set `as-child` and slot your own element.

The default-slot content (or `label` prop) becomes the visible text in button mode; in `icon-only` mode the default slot becomes the icon (override the three-dot default with any 16px SVG).

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `asChild` | `boolean` | `false` | Render the slotted element as the trigger. All built-in styling is skipped. |
| `iconOnly` | `boolean` | `false` | Render a square icon-only trigger. Default glyph is a vertical three-dot. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button: 32 / 36 / 40 px. Icon: 24 / 32 / 40 px square. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `label` | `string` | — | Convenience label for button mode. Default slot wins. |

| Slot | Description |
| ------ | ------------- |
| `default` | Button mode: label text or rich label content. Icon mode: 16px icon override. |
| `leading` | Button mode only — leading 16px icon. |

## DtDropdownMenuContent

Renders inside a `DropdownMenuPortal` with DT styling — white surface, 1px border, `--dt-radius-sm` (8px), `--dt-shadow-lg`, default min-width 13.5rem (216px). Animated via Reka's `data-state` attributes.

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger. |
| `sideOffset` | `number` | `6` | Distance in px between the trigger and the menu. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along the trigger edge. |
| `alignOffset` | `number` | `0` | Offset along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `minWidth` | `string` | `'13.5rem'` | Minimum panel width. |

## DtDropdownMenuItem

A single action row. Default slot is the label; `leading` and `trailing` slots accept 16px icons. Set `destructive` to render the row in the error color (used for "Delete", "Remove", etc.).

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `disabled` | `boolean` | `false` | Skipped by keyboard navigation and not selectable. |
| `destructive` | `boolean` | `false` | Renders in error red. |
| `textValue` | `string` | — | Override the string used for typeahead matching. Defaults to the trimmed text content. |

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `select` | `Event` | Fired on click or Enter/Space. Call `event.preventDefault()` to keep the menu open. |

## DtDropdownMenuSeparator

A 1px hairline divider with 4px vertical breathing room. No props.

## DtDropdownMenuLabel

Non-interactive section heading. Uppercase, body-xs, gray-500. Use it above a `DtDropdownMenuGroup` to label a cluster of related items.

## DtDropdownMenuGroup

Wraps a logical cluster of items for assistive tech (`role="group"`). Purely semantic — no visual styling on its own.

## DtDropdownMenuCheckboxItem

Toggleable item with a check / dash indicator.

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean \| 'indeterminate'` | `false` | Checked state. Use with `v-model`. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `textValue` | `string` | — | Typeahead override. |

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean \| 'indeterminate'` | Standard v-model. |
| `select` | `Event` | Fired on selection. Call `event.preventDefault()` to keep the menu open. |

## DtDropdownMenuRadioGroup

Container that coordinates a set of `DtDropdownMenuRadioItem`s via shared `modelValue`.

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `string` | — | Currently selected value. Use with `v-model`. |

## DtDropdownMenuRadioItem

A single radio option inside a `DtDropdownMenuRadioGroup`.

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `value` | `string` | **required** | This option's value. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `textValue` | `string` | — | Typeahead override. |

## DtDropdownMenuSub / DtDropdownMenuSubTrigger / DtDropdownMenuSubContent

A nested submenu. `Sub` is the controller, `SubTrigger` opens it (renders a trailing chevron-right automatically), `SubContent` is the floating panel.

```vue
<DtDropdownMenuSub>
  <DtDropdownMenuSubTrigger>More options</DtDropdownMenuSubTrigger>
  <DtDropdownMenuSubContent>
    <DtDropdownMenuItem>Rename</DtDropdownMenuItem>
    <DtDropdownMenuItem>Duplicate</DtDropdownMenuItem>
  </DtDropdownMenuSubContent>
</DtDropdownMenuSub>
```

| Prop on `Sub` | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | `undefined` | Controlled open state for the submenu. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled open state. |

| Prop on `SubTrigger` | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `disabled` | `boolean` | `false` | Disabled state. |
| `textValue` | `string` | — | Typeahead override. |

| Prop on `SubContent` | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `sideOffset` | `number` | `6` | Distance from the trigger. |
| `alignOffset` | `number` | `-4` | Cross-axis offset so the panel lines up with the row. |
| `minWidth` | `string` | `'13.5rem'` | Minimum panel width. |

## Accessibility

- Roles applied automatically: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `group`.
- Keyboard: Enter / Space to activate, ArrowUp / ArrowDown to move, Home / End to jump, typeahead to focus by first letter, ArrowRight / ArrowLeft to enter / leave submenus, Esc to close.
- Focus returns to the trigger when the menu closes.
- Disabled items are skipped by keyboard navigation and typeahead.
