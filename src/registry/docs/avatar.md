# DtAvatar

Circular avatar with image, initials, or user-icon fallback. Six sizes (24/32/40/48/56/64px), an optional outer ring, and an optional status indicator at the bottom-right corner.

The package exports four related components:

- **`DtAvatar`** — the base avatar.
- **`DtAvatarLabel`** — avatar + name + flexible description (email, phone, link, anything).
- **`DtAvatarGroup`** — stacked avatars with overlap, optional `+N` overflow, optional add button.
- **`DtAvatarAdd`** — standalone dashed "+" button for the "invite member" pattern (three sizes, hover / focus / disabled states).

## Import

```ts
import { DtAvatar, DtAvatarLabel, DtAvatarGroup, DtAvatarAdd } from '@/components/ui/avatar'
```

## DtAvatar props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `src` | `string` | — | Image URL. Falls back to initials/icon if missing or fails to load. |
| `alt` | `string` | — | Alt text for the image. Defaults to `name` if not provided. |
| `name` | `string` | — | Full name; initials derived from first two words. |
| `initials` | `string` | — | Explicit 1–2 character override. |
| `size` | `AvatarSize` | `'md'` | Box size — `xs` (24) / `sm` (32) / `md` (40) / `lg` (48) / `xl` (56) / `2xl` (64). |
| `bordered` | `boolean` | `false` | Outer 1px ring with a 2px breathing gap. |
| `status` | `AvatarStatus \| null` | `null` | `'online'` (green dot) or `'offline'` (gray dot). Overridden by `#status` slot. |

```ts
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarStatus = 'online' | 'offline'
```

### Fallback hierarchy

1. If `src` is set and loads successfully → render `<img>`.
2. Else if `initials` is set → render those characters.
3. Else if `name` is set → derive initials (first letter of the first two words) and render.
4. Else → render the built-in user icon.

If an image fails to load (`onerror`), the component falls back automatically.

## Slots

| Slot | Description |
| ------ | ------------- |
| `status` | Custom status indicator content (brand icon, verified badge, count, etc.). Overrides the `status` prop visual. The avatar handles position, size, and the white halo against the avatar edge — the slot fills the wrapper. |

## Examples

### Image, initials, icon fallback

```vue
<DtAvatar src="/avatars/mardon.jpg" name="Mardon Shonazarov" />
<DtAvatar name="Mardon Shonazarov" />     <!-- "MS" -->
<DtAvatar initials="DT" />
<DtAvatar />                              <!-- user icon -->
```

### Online / offline dot

```vue
<DtAvatar src="/me.jpg" status="online" />
<DtAvatar src="/me.jpg" status="offline" />
```

### Custom status indicator (anything)

The `#status` slot lets you drop in any element — brand icons, a verified badge, a count, an `<img>`, or your own SVG. The wrapper takes care of positioning and the white halo.

```vue
<!-- Brand icon (any icon library, here lucide-vue-next) -->
<DtAvatar src="/me.jpg">
  <template #status>
    <Send :size="12" color="#3b82f6" fill="#3b82f6" />
  </template>
</DtAvatar>

<!-- Numeric count badge -->
<DtAvatar src="/me.jpg">
  <template #status>
    <span class="my-count">8</span>
  </template>
</DtAvatar>

<!-- Verified checkmark -->
<DtAvatar src="/me.jpg">
  <template #status>
    <svg viewBox="0 0 16 16">…</svg>
  </template>
</DtAvatar>
```

### Bordered

```vue
<DtAvatar src="/me.jpg" bordered />
```

## DtAvatarLabel

Horizontal `Avatar + name + description` composition. The description is **fully flexible** — it accepts a `description` prop for the simple text case, or a `#description` slot for anything else (email link, multiple lines, badges, phone number).

### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `name` | `string` | **required** | Primary text. Rendered bold. |
| `description` | `string` | — | Secondary text. Skip when using the `#description` slot. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maps to avatar size 32 / 40 / 48 and matching typography. |
| `src` / `alt` / `initials` / `status` / `bordered` | — | — | Forwarded to the default `DtAvatar`. Skip when using the `#avatar` slot. |

### Slots

| Slot | Description |
| ------ | ------------- |
| `avatar` | Override the default avatar entirely. Receives the resolved `size` as a slot prop. |
| `description` | Custom secondary content — links, multiple lines, badges, mixed text and icons. |

### Examples

```vue
<!-- Simplest — single name -->
<DtAvatarLabel name="Mardon Shonazarov" />

<!-- Name + secondary text -->
<DtAvatarLabel
  name="Mardon Shonazarov"
  description="mardon.shonazarov@gmail.com"
  src="/avatars/mardon.jpg"
  size="md"
/>

<!-- Phone number instead of email -->
<DtAvatarLabel
  name="Mardon Shonazarov"
  description="+998 90 123 45 67"
  src="/avatars/mardon.jpg"
/>

<!-- Linked email via slot -->
<DtAvatarLabel name="Mardon Shonazarov" src="/me.jpg">
  <template #description>
    <a href="mailto:mardon@example.com">mardon@example.com</a>
  </template>
</DtAvatarLabel>

<!-- Avatar with status, custom description -->
<DtAvatarLabel name="Mardon Shonazarov" status="online" src="/me.jpg" size="lg">
  <template #description>
    <span style="color: var(--dt-color-success);">Active now</span>
  </template>
</DtAvatarLabel>

<!-- Fully custom avatar (e.g. with a brand-icon status) -->
<DtAvatarLabel name="Mardon Shonazarov" description="Telegram: @mardon">
  <template #avatar="{ size }">
    <DtAvatar :size="size" src="/me.jpg">
      <template #status>
        <svg viewBox="0 0 16 16">…telegram icon…</svg>
      </template>
    </DtAvatar>
  </template>
</DtAvatarLabel>
```

## DtAvatarGroup

Horizontal stack of avatars with overlap, an optional `+N` overflow chip, and an optional add button. Three sizes — `xs` (24), `sm` (32), `md` (40) — with overlap `4 / 8 / 12px` and a 1.5px white halo on each avatar so they read cleanly against each other.

### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `users` | `Array<{ src?, alt?, name?, initials? }>` | `[]` | Data-driven shortcut — renders one `DtAvatar` per entry. |
| `max` | `number` | — | Visible cap when using `users`. Extra users collapse into a `+N` chip. |
| `size` | `'xs' \| 'sm' \| 'md'` | `'md'` | Controls overlap and child avatar size. |
| `showAdd` | `boolean` | `false` | Appends a `DtAvatarAdd` after the stack. |
| `addAriaLabel` | `string` | `'Add member'` | `aria-label` for the add button. |

### Events

| Event | Description |
| ------- | ------------- |
| `add` | Fired when the add button is clicked. |

### Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Slot-based override — drop `DtAvatar` children directly. Stacking and white halo are applied via CSS; you control individual avatar props (size, status, bordered). |

### Examples

```vue
<!-- Data-driven, 5 visible, overflow into +N -->
<DtAvatarGroup
  :users="users"
  :max="5"
  size="md"
  show-add
  @add="invite"
/>

<!-- Slot-based for full control -->
<DtAvatarGroup size="md" show-add @add="invite">
  <DtAvatar src="/a.jpg" />
  <DtAvatar src="/b.jpg" />
  <DtAvatar name="Mardon Shonazarov" />
</DtAvatarGroup>
```

> Status indicators on avatars inside a stacked group are hidden — the overlap clips them. Use a non-stacked layout (e.g. a list with `DtAvatarLabel`) if you need per-avatar status.

## DtAvatarAdd

Standalone dashed-circle "+" button. Use it inside an `AvatarGroup` (set `show-add`), or anywhere else you need an "add member"-style affordance.

### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `size` | `'xs' \| 'sm' \| 'md'` | `'md'` | Box size (24 / 32 / 40). |
| `disabled` | `boolean` | `false` | Native `disabled` state. |
| `ariaLabel` | `string` | `'Add'` | Accessible name (icon-only button). |

### States

Built-in hover (tinted background + darker border), `:focus-visible` ring at `--dt-color-ring`, and disabled (muted background, no pointer).

```vue
<DtAvatarAdd size="sm" @click="invite" />
<DtAvatarAdd size="md" disabled />
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background-tertiary` | Avatar fallback background. |
| `--dt-color-border` | Inner 1px border and bordered outer ring. |
| `--dt-color-text-tertiary` | Initials and user-icon color. |
| `--dt-color-background` | White halo around the status indicator. |
| `--dt-color-success` | `status="online"` dot. |
| `--dt-gray-300` | `status="offline"` dot. |
| `--dt-radius-full` | Circle radius. |
| `--dt-spacing-md` | Gap between avatar and label in `DtAvatarLabel`. |

## Accessibility

- `<img>` uses `alt` (or `name` as fallback). Decorative avatars can pass `alt=""`.
- The user-icon fallback is `aria-hidden`.
- When initials render, a visually-hidden text node carries the full name so screen readers announce the person, not the letters.
- The status indicator is decorative by default — convey meaningful state through text in `DtAvatarLabel` (e.g. "Active now") rather than relying on color alone.
