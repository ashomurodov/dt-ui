# DtSelect

A custom dropdown select component with keyboard navigation, optional search filtering, and proper ARIA semantics. Uses a compound component pattern with `DtSelectTrigger`, `DtSelectContent`, and `DtSelectItem`. State is shared between sub-components through Vue's `provide`/`inject`. The dropdown content is positioned absolutely below the trigger.

## Import

```ts
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'
```

## Components

### DtSelect

The root wrapper. Manages selection state, item registration, open/close behavior, search filtering, and keyboard highlight index. Provides all state to children via `provide('dt-select', ...)`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | `null` | The currently selected value. Use with `v-model`. |
| `placeholder` | `string` | `'Select an option...'` | Text displayed in the trigger when no item is selected. |
| `disabled` | `boolean` | `false` | Disables the entire select (reduces opacity, prevents pointer events). |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| null` | Emitted when a new item is selected. |

### DtSelectTrigger

A `<button>` element that displays the current selection and toggles the dropdown. Includes a chevron icon that rotates 180 degrees when open.

#### Props

None. Attributes are forwarded via `$attrs`.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Custom trigger content. If not provided, the trigger displays the selected item's label or the placeholder text. |

#### Keyboard Handling (on the trigger)

| Key | Behavior |
|-----|----------|
| `Enter` / `Space` | If closed, opens the dropdown. If open and an item is highlighted, selects that item. |
| `ArrowDown` | Opens the dropdown if closed. If open, moves highlight to the next item. |
| `ArrowUp` | Moves highlight to the previous item (when open). |
| `Escape` | Closes the dropdown. |

#### ARIA Attributes

- `role="combobox"` on the trigger button.
- `aria-expanded` reflects the open state.
- `aria-haspopup="listbox"` indicates the popup type.

### DtSelectContent

The dropdown panel. Positioned absolutely below the trigger. Uses Vue's `<Transition>` for a fade-and-slide animation. Handles click-outside detection to close the dropdown.

#### Props

None. Attributes are forwarded via `$attrs` onto the `role="listbox"` container.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | The list of `DtSelectItem` components. |
| `search` | Optional search input area rendered at the top of the dropdown with a bottom border. |
| `empty` | Optional content shown when no items match a search filter (centered, muted text). |

#### ARIA Attributes

- `role="listbox"` on the content container.

### DtSelectItem

An individual option in the dropdown. Registers itself with the parent `DtSelect` on mount and unregisters on unmount. Displays a checkmark icon when selected.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | **required** | The value associated with this item. Must be unique within the select. |
| `label` | `string` | `String(value)` | Display text for the item. Used for search filtering and as the trigger display when selected. Falls back to stringified `value` if not provided. |
| `disabled` | `boolean` | `false` | Prevents selection and reduces opacity. |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Custom item content. Defaults to displaying `label` or `value`. |

#### ARIA Attributes

- `role="option"` on each item.
- `aria-selected` reflects whether this item is the current selection.
- `aria-disabled` reflects the disabled state.

## Usage Examples

### Basic Select

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'

const fruit = ref<string | null>(null)
</script>

<template>
  <DtSelect v-model="fruit" placeholder="Pick a fruit...">
    <DtSelectTrigger>
      {{ fruit ?? 'Pick a fruit...' }}
    </DtSelectTrigger>
    <DtSelectContent>
      <DtSelectItem value="apple" label="Apple" />
      <DtSelectItem value="banana" label="Banana" />
      <DtSelectItem value="cherry" label="Cherry" />
      <DtSelectItem value="dragonfruit" label="Dragonfruit" :disabled="true" />
    </DtSelectContent>
  </DtSelect>
</template>
```

### Select with Search Filter

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'
import { DtInput } from '@/components/ui/input'

const country = ref<string | null>(null)

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
]

const selectedLabel = computed(() =>
  countries.find(c => c.value === country.value)?.label ?? 'Select a country...'
)
</script>

<template>
  <DtSelect v-model="country">
    <DtSelectTrigger>{{ selectedLabel }}</DtSelectTrigger>
    <DtSelectContent>
      <template #search>
        <!-- The search ref is available on the injected context.
             You can bind a DtInput to it for filtering. -->
        <input
          class="dt-input"
          placeholder="Search countries..."
          style="height: 2rem; font-size: 0.8125rem;"
        />
      </template>

      <DtSelectItem
        v-for="c in countries"
        :key="c.value"
        :value="c.value"
        :label="c.label"
      />

      <template #empty>
        <span>No countries found.</span>
      </template>
    </DtSelectContent>
  </DtSelect>
</template>
```

### Composed with DtCard and DtButton for a Settings Form

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'
import { DtCard, DtCardHeader, DtCardContent, DtCardFooter } from '@/components/ui/card'
import { DtButton } from '@/components/ui/button'

const theme = ref<string | null>('system')
const language = ref<string | null>('en')

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

function getLabel(items: typeof themes, val: string | null) {
  return items.find(i => i.value === val)?.label ?? 'Select...'
}
</script>

<template>
  <DtCard style="max-width: 28rem;">
    <DtCardHeader>
      <h3>Preferences</h3>
      <p>Customize your experience.</p>
    </DtCardHeader>
    <DtCardContent>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.25rem; display: block;">
            Theme
          </label>
          <DtSelect v-model="theme">
            <DtSelectTrigger>{{ getLabel(themes, theme) }}</DtSelectTrigger>
            <DtSelectContent>
              <DtSelectItem
                v-for="t in themes"
                :key="t.value"
                :value="t.value"
                :label="t.label"
              />
            </DtSelectContent>
          </DtSelect>
        </div>

        <div>
          <label style="font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.25rem; display: block;">
            Language
          </label>
          <DtSelect v-model="language">
            <DtSelectTrigger>{{ getLabel(languages, language) }}</DtSelectTrigger>
            <DtSelectContent>
              <DtSelectItem
                v-for="l in languages"
                :key="l.value"
                :value="l.value"
                :label="l.label"
              />
            </DtSelectContent>
          </DtSelect>
        </div>
      </div>
    </DtCardContent>
    <DtCardFooter>
      <DtButton variant="outline">Reset</DtButton>
      <DtButton>Save Preferences</DtButton>
    </DtCardFooter>
  </DtCard>
</template>
```

## CSS Custom Properties

### DtSelect (root)

No visual custom properties. The root is a positioned container.

### DtSelectTrigger

| Property | Usage |
|----------|-------|
| `--dt-color-text` | Trigger text color. |
| `--dt-color-background` | Trigger background color. |
| `--dt-color-border` | Default border color. |
| `--dt-color-border-hover` | Border color on hover. |
| `--dt-color-ring` | Border color on focus and when open. Focus also applies a 2px box-shadow ring. |
| `--dt-color-text-secondary` | Chevron icon color. |
| `--dt-space-2` | Margin between value text and chevron. |
| `--dt-radius-md` | Trigger border-radius. |
| `--dt-text-base` | Trigger font size. |
| `--dt-transition-base` | Duration/easing for border-color, box-shadow, and chevron rotation transitions. |

### DtSelectContent

| Property | Usage |
|----------|-------|
| `--dt-z-dropdown` | z-index for the dropdown panel. |
| `--dt-color-background` | Dropdown background color. |
| `--dt-color-border` | Dropdown border color. Also used for the search section bottom border. |
| `--dt-radius-md` | Dropdown border-radius. |
| `--dt-shadow-md` | Dropdown box-shadow. |
| `--dt-space-1` | Vertical padding inside the dropdown list. |
| `--dt-space-2` | Padding inside the search section. |
| `--dt-space-4` | Padding inside the empty state section. |
| `--dt-text-sm` | Empty state font size. |
| `--dt-color-text-secondary` | Empty state text color. |

### DtSelectItem

| Property | Usage |
|----------|-------|
| `--dt-color-text` | Item text color. |
| `--dt-color-surface-hover` | Item background on hover/highlight. |
| `--dt-color-accent` | Checkmark icon color for selected items. |
| `--dt-space-2` | Gap between checkmark and label. |
| `--dt-space-3` | Horizontal padding. |
| `--dt-text-base` | Item font size. |
| `--dt-transition-fast` | Duration/easing for background-color transitions on hover. |

## Accessibility

- **ARIA roles**: The trigger uses `role="combobox"` with `aria-expanded` and `aria-haspopup="listbox"`. The dropdown uses `role="listbox"`. Each item uses `role="option"` with `aria-selected` and `aria-disabled`.
- **Keyboard navigation**: Full keyboard support is implemented on the trigger button:
  - `ArrowDown` / `ArrowUp` move the highlighted item.
  - `Enter` / `Space` select the highlighted item or toggle the dropdown.
  - `Escape` closes the dropdown.
- **Focus management**: Focus remains on the trigger button while the dropdown is open. The highlighted item is tracked via index, not DOM focus, so the combobox pattern is maintained correctly.
- **Click outside**: Clicking outside the dropdown content closes it. The event listener is attached/detached dynamically based on open state.
- **Disabled items**: Items with `disabled` set to `true` have `aria-disabled="true"`, reduced opacity, and `pointer-events: none`.
- **Disabled select**: When the entire `DtSelect` is disabled, the root wrapper gets `pointer-events: none` and reduced opacity, preventing all interaction.
- **Selected state**: The currently selected item displays a checkmark icon and `font-weight: 500` for visual distinction. The checkmark is supplementary since `aria-selected` communicates the state to assistive technologies.
- For screen reader users, consider adding an `aria-label` or visible `<label>` element associated with the trigger button to describe what the select controls (e.g., "Choose a theme").
