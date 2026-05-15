# DtBadgeGroup

Compound announcement badge: a small colored pill (or modern outline badge with a dot) paired with body text and an optional trailing arrow. Used for release banners, status callouts, and inline notifications. Renders as `<a>` when `href` is set, otherwise as a `<div>`.

## Import

```ts
import { DtBadgeGroup } from '@/components/ui/badge-group'
```

## Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `color` | `'gray' \| 'brand' \| 'error' \| 'warning' \| 'success'` | `'gray'` | Color family. |
| `type` | `'pill' \| 'modern'` | `'pill'` | `pill` fills the outer with the color; `modern` keeps it white and uses a colored dot. |
| `size` | `'md' \| 'lg'` | `'md'` | `md` uses body-xs typography; `lg` uses body-sm and a slightly taller inner pill. |
| `position` | `'leading' \| 'trailing'` | `'leading'` | `leading` places the pill on the left; `trailing` places it on the right with the arrow inside it. |
| `label` | `string` | — | Pill / badge text. |
| `text` | `string` | — | Body text. |
| `href` | `string` | — | If provided, renders as `<a>`. |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | — | Forwarded to the `<a>`. When `_blank`, `rel="noopener noreferrer"` is added automatically. |
| `arrow` | `boolean` | `true` | Show the trailing arrow icon. |

## Slots

| Slot | Description |
| ------ | ------------- |
| `default` | Body text. Overrides `text`. |
| `label` | Pill / badge content. Overrides `label`. |
| `arrow` | Custom trailing icon. Replaces the built-in arrow. |

## Examples

### Leading pill (default)

```vue
<DtBadgeGroup label="Version 4.0" text="We've just released a new feature" href="/changelog" />
```

### Trailing pill

```vue
<DtBadgeGroup
  position="trailing"
  label="Version 4.0"
  text="We've just released a new feature"
  href="/changelog"
/>
```

### Modern type (white container, colored dot)

```vue
<DtBadgeGroup
  type="modern"
  color="success"
  label="Success"
  text="You've updated your profile"
/>
```

### Color variants (pill type)

```vue
<DtBadgeGroup color="brand"   label="New feature" text="We've just released a new feature" />
<DtBadgeGroup color="error"   label="Error"       text="There was a problem with that action" />
<DtBadgeGroup color="warning" label="Warning"     text="Just to let you know this might be a problem" />
<DtBadgeGroup color="success" label="Success"     text="You've updated your profile and details" />
```

### lg size

```vue
<DtBadgeGroup size="lg" color="brand" label="New feature" text="Updated profile picker" />
```

### Hide the arrow

```vue
<DtBadgeGroup label="Version 4.0" text="Release notes inline" :arrow="false" />
```

### Custom label / arrow

```vue
<DtBadgeGroup color="brand" text="Check it out">
  <template #label>
    <SparkleIcon :size="12" />
    New
  </template>
</DtBadgeGroup>
```

## CSS Custom Properties

| Property | Usage |
| ---------- | ------- |
| `--dt-color-background` | Modern type outer + inner pill background. |
| `--dt-color-border` | Default outer/inner border (gray / modern). |
| `--dt-shadow-xs` | Drop shadow on both outer and inner pill. |
| `--dt-radius-full` | Pill type radius. |
| `--dt-radius-sm` / `--dt-radius-xs` | Modern type outer / inner radius. |
| `--dt-gray-50` / `--dt-gray-100` | Gray pill default / hover background. |
| `--dt-gray-300` | Modern type dot for `color="gray"`. |
| `--dt-gray-600` / `--dt-gray-700` | Pill label / body text in gray and modern. |
| `--dt-brand-50` / `--dt-brand-100` / `--dt-brand-200` / `--dt-brand-500` / `--dt-brand-600` | Brand color family. |
| `--dt-error-*`, `--dt-warning-*`, `--dt-success-*` | Same scale stops for the other three colors. |
| `--dt-text-body-xs` / `--dt-text-body-sm` | md / lg font sizes. |
| `--dt-color-ring` | Focus ring when used as an `<a>`. |

## Accessibility

- Renders a real `<a>` when `href` is set — keyboard-focusable, native semantics, visible focus ring.
- Dot and arrow icons are marked `aria-hidden` — text content carries the meaning.
- When `target="_blank"` is set, the component adds `rel="noopener noreferrer"` automatically.
