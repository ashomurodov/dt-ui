# Theming

DT UI uses CSS custom properties (design tokens) for all visual decisions. Override them to match your brand.

## Design Tokens

All tokens are prefixed with `--dt-` and defined in `base.css`. Here are the main categories:

### Colors

| Token | Description |
| ------- | ------------- |
| `--dt-primary` | Brand/primary color |
| `--dt-primary-hover` | Primary hover state |
| `--dt-primary-foreground` | Text on primary background |
| `--dt-secondary` | Secondary background |
| `--dt-destructive` | Destructive/danger actions |
| `--dt-success` | Success state |
| `--dt-warning` | Warning state |
| `--dt-muted` | Muted background |
| `--dt-accent` | Accent/hover background |
| `--dt-border` | Default border color |
| `--dt-ring` | Focus ring color |

### Spacing

Tokens follow a named scale: `--dt-spacing-none` (0) through `--dt-spacing-11xl` (10rem / 160px). Common stops: `--dt-spacing-xs` (4px), `--dt-spacing-md` (8px), `--dt-spacing-lg` (12px), `--dt-spacing-xl` (16px), `--dt-spacing-3xl` (24px).

### Radii

`--dt-radius-none`, `--dt-radius-xxs` (4px), `--dt-radius-xs` (6px), `--dt-radius-sm` (8px), `--dt-radius-md` (12px), `--dt-radius-lg` (16px), `--dt-radius-xl` (20px), `--dt-radius-2xl` (24px), `--dt-radius-3xl` (32px), `--dt-radius-4xl` (40px), `--dt-radius-full`.

### Shadows

`--dt-shadow-sm`, `--dt-shadow-md`, `--dt-shadow-lg`.

### Typography

`--dt-font-sans`, `--dt-font-mono`, and font size tokens from `--dt-font-size-xs` to `--dt-font-size-xl`.

## Customizing

Override tokens in your own CSS, loaded after `base.css`:

```css
:root {
  --dt-primary: hsl(262 83% 58%);        /* Purple brand */
  --dt-primary-hover: hsl(262 83% 50%);
  --dt-radius-md: 0.5rem;                /* Rounder corners */
}
```

## Dark Mode

Add the `dark` class to your `<html>` or `<body>` element:

```html
<html class="dark">
```

Toggle programmatically:

```ts
function toggleDark() {
  document.documentElement.classList.toggle('dark')
}
```

All tokens automatically adjust for dark mode. You can override dark-mode tokens too:

```css
.dark {
  --dt-primary: hsl(262 83% 70%);
}
```

## Creating a Custom Theme

Create a theme file and import it after `base.css`:

```css
/* styles/theme.css */
:root {
  --dt-primary: hsl(160 84% 39%);
  --dt-primary-hover: hsl(160 84% 32%);
  --dt-primary-foreground: hsl(0 0% 100%);
  --dt-font-sans: 'Poppins', sans-serif;
  --dt-radius-md: 0.75rem;
}

.dark {
  --dt-primary: hsl(160 84% 50%);
  --dt-primary-hover: hsl(160 84% 58%);
}
```
