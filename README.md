# dt-ui

Vue 3 component library for the DT Ecosystem. Copy-based distribution — components are installed into your project, giving you full ownership and customization.

**15 components** | **Vue 3 + TypeScript** | **Copy-based registry** | **Dark mode** | **Figma design system**

## Quick Start

```bash
npm install aetherx-dt-ui
npx dt-ui init
npx dt-ui add button input layout
```

Import styles in your `main.ts`:

```ts
import '@/styles/base.css'
import '@/styles/table-cells.css'
```

## Components

```bash
npx dt-ui list    # see all available
npx dt-ui add <name>  # install to your project
```

| Component | Install | Description |
|-----------|---------|-------------|
| **DtButton** | `add button` | 4 variants (primary / secondary / outline / ghost), 5 sizes (xl–xs) |
| **DtInput** | `add input` | 4 sizes, label, hint, error, success, disabled states |
| **DtSelect** | `add select` | Dropdown with search, keyboard navigation, ARIA |
| **DtToggle** | `add toggle` | Switch toggle, 3 sizes (lg / md / sm) |
| **DtCheckbox** | `add checkbox` | Checkbox with label, 3 sizes |
| **DtRadio** | `add radio` | Radio button with label, 3 sizes, animated dot |
| **DtBadge** | `add badge` | 6 colors (gray / green / red / blue / orange / yellow), dot indicator |
| **DtStatusBadge** | `add status-badge` | Semantic status pills (active / inactive / moderation / rejected / blocked) |
| **DtCard** | `add card` | Compound card with header, content, footer |
| **DtDialog** | `add dialog` | Modal with overlay, focus trap, keyboard support |
| **DtDataTable** | `add data-table` | Column config, slot-based cells, loading, striped mode |
| **DtPagination** | `add pagination` | 2 variants, 3 sizes, smart ellipsis, 5-page window |
| **DtTabSwitcher** | `add tab-switcher` | Animated tab bar with FLIP indicator, badge counts |
| **DtSearchToolbar** | `add search-toolbar` | Search input + action button, responsive |
| **DtLayout** | `add layout` | Full app shell — header, sidebar, profile modal, page view, divider |

## App Shell (Layout)

The layout system gives you a complete app shell with one command:

```bash
npx dt-ui add layout
```

Add the DT modules modal to your `index.html`:

```html
<script src="https://cdn.dthub.uz/dt-header/dist/dt-header.js"></script>
<link rel="stylesheet" href="https://cdn.dthub.uz/dt-header/dist/style.css">
```

Wire it up in `App.vue`:

```vue
<script setup>
import {
  DtLayout, DtLayoutHeader, DtLayoutSidebar, DtProfileModal
} from '@/components/ui/layout'

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Dashboard' },
  { to: '/docs', icon: DocsIcon, label: 'Documents' },
]
</script>

<template>
  <DtLayout>
    <template #header>
      <DtLayoutHeader
        badge="Module Name"
        active-module="my-module"
        :env-mode="envMode"
        :profile-name="user.first_name + ' ' + user.last_name"
        :profile-avatar="avatarUrl"
        @toggle-profile="showProfile = !showProfile"
      >
        <template #logo>
          <RouterLink to="/"><LogoIcon /></RouterLink>
        </template>
        <template #profile-dropdown>
          <DtProfileModal
            v-model="showProfile"
            :user="user"
            :locale="locale"
            :theme="theme"
            :resource-url="API_FILE_URL"
            profile-url="https://id.dthub.uz/cabinet"
            @theme-change="setTheme"
            @locale-change="setLang"
            @logout="logout()"
          />
        </template>
      </DtLayoutHeader>
    </template>

    <template #sidebar>
      <DtLayoutSidebar :items="navItems" :mobile-items="4" />
    </template>

    <router-view />
  </DtLayout>
</template>
```

**What you get out of the box:**

- Sticky header (84px) with logo, badge, modules grid button, profile avatar
- DT modules modal (auto-initializes, highlights active module)
- Profile dropdown with user info, theme switcher (light / dark / system), language picker (uz / ru / en), logout — all labels built-in with i18n
- Desktop sidebar (sticky, scrollable, collapsible sections)
- Mobile bottom navigation (auto-switches below 1024px)
- Avatar with initials fallback

## List Page Pattern

The most common page type across DT modules:

```vue
<template>
  <DtPageView title="Documents">
    <DtTabSwitcher v-model="activeTab" :tabs="tabs" style="margin-bottom: 24px" />
    <DtSearchToolbar v-model:search="search" add-label="Create" @add="create" @search="fetch" />
    <DtDivider />
    <DtDataTable :columns="columns" :items="items" :loading="loading">
      <template #status="{ item }">
        <DtStatusBadge :variant="item.variant">{{ item.label }}</DtStatusBadge>
      </template>
    </DtDataTable>
    <DtPagination v-model:page="page" :total-count="totalCount" />
  </DtPageView>
</template>
```

## Design Tokens

All components use CSS custom properties from `base.css`. Full 9-step color scales:

```css
/* Brand */     --dt-brand-100 ... --dt-brand-900
/* Gray */      --dt-gray-100 ... --dt-gray-900
/* Success */   --dt-success-100 ... --dt-success-900
/* Error */     --dt-error-100 ... --dt-error-900
/* Warning */   --dt-warning-100 ... --dt-warning-900
/* Blue */      --dt-blue-100 ... --dt-blue-900
/* Yellow */    --dt-yellow-100 ... --dt-yellow-900
```

Semantic tokens reference the scales:

```css
--dt-color-accent: var(--dt-brand-500);      /* #0096b2 */
--dt-color-text: var(--dt-gray-900);          /* #101828 */
--dt-color-border: var(--dt-gray-200);        /* #e4e7ec */
--dt-color-success: var(--dt-success-600);    /* #4ba624 */
--dt-color-error: var(--dt-error-500);        /* #ff597f */
```

### Dark Mode

Set `data-theme="dark"` on `<html>`. All tokens adjust automatically.

## Updating

```bash
npm install aetherx-dt-ui@latest
npx dt-ui update
```

- **Always updates**: `base.css`, `table-cells.css`, `utils.ts`, `AGENT.md`
- **Asks before overwriting**: component `.vue` files (say Yes for latest fixes, No to keep local changes)

## TypeScript Setup

In `tsconfig.app.json`, add the path alias:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

For SVG icon imports, create `src/env.d.ts`:

```ts
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```

## Tech Stack

- **Vue 3** Composition API + `<script setup>`
- **TypeScript** — full type safety
- **Pure CSS** custom properties — no Tailwind, no preprocessor needed
- **Reka UI for primitives** — behavior-heavy components like Dialog and Select use accessible headless primitives
- **vite-svg-loader** compatible for icons

## License

MIT
