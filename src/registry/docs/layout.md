# DtLayout

A complete application shell layout system with header, sidebar, modules modal, profile modal, page view, and divider components. Provides the standard DT platform layout: sticky header, sidebar navigation (desktop) / bottom nav (mobile), and a centered content area.

## Import

```ts
import {
  DtLayout,
  DtLayoutHeader,
  DtLayoutSidebar,
  DtModulesModal,
  DtProfileModal,
  DtPageView,
  DtDivider,
} from '@/components/ui/layout'

import type {
  DtModuleClickPayload,
  DtModuleItem,
  DtNavItem,
  DtNavSection,
  DtUser,
  DtProfileMenuItem,
} from '@/components/ui/layout'
```

## Components

### DtLayout

The root shell. Uses CSS Grid to position sidebar and content side-by-side on desktop, stacked on mobile.

#### Slots

| Slot | Description |
| ------ | ------------- |
| `header` | Place `DtLayoutHeader` here. Renders in a sticky header area. |
| `sidebar` | Place `DtLayoutSidebar` here. Desktop: sticky sidebar. Mobile: fixed bottom nav. |
| `default` | Page content (`<router-view />`). |
| `footer` | Optional footer, rendered after the main grid. |

---

### DtLayoutHeader

Pre-styled header with logo area, badge, module switcher button, and profile avatar button. Height: 84px desktop, 76px mobile.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `badge` | `string` | `undefined` | Badge text displayed next to the logo (e.g., "Specialist", "Cabinet"). |
| `profileName` | `string` | `undefined` | Used to generate avatar initials when no image is provided. |
| `profileAvatar` | `string` | `undefined` | URL for the profile avatar image. Falls back to initials. |
| `activeModule` | `string` | `'cabinet'` | Current module key. Highlights the matching item in the modules modal. |
| `envMode` | `'dev' \| 'preprod' \| 'prod'` | `'dev'` | Legacy compatibility prop. The built-in modal does not use it. |
| `showModulesButton` | `boolean` | `true` | Whether to show the grid modules button. |
| `modules` | `DtModuleItem[]` | `[]` | Items shown in the built-in modules modal. |
| `modulesTitle` | `string` | `'Modules'` | Optional modal title. |
| `modulesDescription` | `string` | `''` | Optional modal description. |
| `modulesCloseLabel` | `string` | `'Close modules'` | Accessible label for the close button. |

#### Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `toggle-profile` | — | Emitted when the profile avatar button is clicked. |
| `modules-click` | `MouseEvent` | Emitted when the modules button is clicked. |
| `module-click` | `DtModuleClickPayload` | Emitted when a module item is clicked. |

#### Modules Modal (Built-in)

The header opens `DtModulesModal` automatically when `modules` has visible items. No CDN script is required.

```ts
interface DtModuleItem {
  key: string
  label: string
  href?: string
  logo?: string
  icon?: any
  badge?: string | number
  description?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  active?: boolean
  disabled?: boolean
  hidden?: boolean
  span?: 'default' | 'full'
  onClick?: (payload: DtModuleClickPayload) => void | Promise<void>
}
```

Use `href` for normal navigation, `onClick` for app-owned behavior, `logo` for image URLs, or `icon` for Vue icon components. The app owns module URLs, auth checks, and any custom routing. Call `payload.event.preventDefault()` in `@module-click` when you need to stop a link.

#### Slots

| Slot | Description |
| ------ | ------------- |
| `logo` | Logo content (e.g., `<RouterLink to="/"><LogoIcon /></RouterLink>`). |
| `actions` | Extra action buttons between the modules button and profile button. |
| `profile-dropdown` | Place `DtProfileModal` here for the profile dropdown. |

---

### DtLayoutSidebar

Config-driven sidebar navigation. Desktop: sticky scrollable sidebar with collapsible sections. Mobile: fixed bottom nav showing first N items.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `items` | `DtNavItem[]` | **required** | Main navigation items. |
| `sections` | `DtNavSection[]` | `[]` | Optional collapsible grouped sections below the main items. |
| `mobileItems` | `number` | `5` | Number of items visible in the mobile bottom nav. |

#### Types

```ts
interface DtNavItem {
  to: string          // Route path
  icon?: Component    // SVG icon component
  label: string       // Display text
}

interface DtNavSection {
  title: string       // Section header (uppercase, small text)
  items: DtNavItem[]  // Sub-navigation items
  collapsible?: boolean // Default true — adds expand/collapse chevron
}
```

#### Slots

| Slot | Description |
| ------ | ------------- |
| `desktop-extra` | Extra content at the bottom of the desktop sidebar. |
| `mobile-extra` | Extra items in the mobile bottom nav. |

#### Features

- Active route highlighting via Vue Router's `router-link-active` class.
- Collapsible sections with animated chevron (90° rotation) and slide transition.
- Desktop: 246px wide, sticky, hidden scrollbar, max-height to viewport.
- Mobile (≤1024px): Fixed bottom bar, horizontal layout, first N items shown.

---

### DtProfileModal

Fully self-contained profile dropdown with user info, theme switcher, language picker, and logout. All labels are built-in with i18n in 3 languages (uz/ru/en). Theme options (light/dark/system) and locale options (uz/ru/en) are hardcoded — no configuration needed.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `modelValue` | `boolean` | **required** | Controls visibility. Use with `v-model`. |
| `user` | `DtUser` | **required** | User object. The component extracts name, initials, phone, and avatar automatically. |
| `locale` | `'uz' \| 'ru' \| 'en'` | `'uz'` | Current language. Controls which built-in translations are shown. |
| `theme` | `'light' \| 'dark' \| 'system'` | `'light'` | Current theme. Controls which radio button is selected. |
| `menuItems` | `DtProfileMenuItem[]` | `[]` | Optional extra menu items specific to the module. |
| `isOrganization` | `boolean` | `false` | If true, displays `user.organization_name` instead of personal name. |
| `profileUrl` | `string` | `undefined` | URL for the "Profile" link (opens in new tab). If not set, profile link is hidden. |
| `resourceUrl` | `string` | `undefined` | Base URL for file resources (e.g., `https://resource.dthub.uz/api/file/view-image`). Prepended to `user.logo_url` to build the full avatar URL. |

#### DtUser Interface

```ts
interface DtUser {
  first_name: string
  last_name: string
  middle_name?: string
  logo_url?: string
  phone_numbers?: { number: string }[]
  organization_name?: string
}
```

#### DtProfileMenuItem Interface

```ts
interface DtProfileMenuItem {
  key: string        // Unique identifier
  label: string      // Display text
  icon?: Component   // Optional icon component
  href?: string      // If set, opens URL in new tab instead of emitting
}
```

#### Events

| Event | Payload | Description |
| ------- | --------- | ------------- |
| `update:modelValue` | `boolean` | Controls open/close state. |
| `theme-change` | `'light' \| 'dark' \| 'system'` | Emitted when a theme option is selected. |
| `locale-change` | `'uz' \| 'ru' \| 'en'` | Emitted when a language option is selected. |
| `logout` | — | Emitted when logout is clicked. |
| `menu-click` | `string` | Emitted when a custom menu item is clicked (receives the item's `key`). |

#### Slots

| Slot | Description |
| ------ | ------------- |
| `menu-extra` | Extra `<li>` items injected into the built-in menu (between language and logout). |

#### Built-in Features

- **3 animated views**: Main → Appearance / Language (slide transitions, 250ms).
- **Built-in i18n**: Labels for "Appearance", "Language", "Logout", theme names in uz/ru/en.
- **Hardcoded options**: Theme (light/dark/system), locale (O'zbekcha/Русский/English).
- **Auto-computed**: Display name, initials, phone number from the `user` object.
- **Close behavior**: Click outside, Escape key, close button.
- **Radio buttons**: Animated dot pop (scale 0 → 1.2 → 1, 200ms).

---

### DtPageView

A centered page content container with optional title. Max-width defaults to 1100px. Responsive padding.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `title` | `string` | `undefined` | Page heading (32px, bold). |
| `maxWidth` | `string` | `'1100px'` | CSS max-width for the content area. |

#### Slots

| Slot | Description |
| ------ | ------------- |
| `title` | Custom title content (replaces the `title` prop heading). |
| `default` | Page content. |

---

### DtDivider

A 1px horizontal line separator.

#### Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `spacing` | `string` | `'16px'` | Bottom margin. |

---

## Full Example: Complete App Shell

```vue
<script setup lang="ts">
import {
  DtLayout, DtLayoutHeader, DtLayoutSidebar,
  DtProfileModal, DtPageView, DtDivider,
} from '@/components/ui/layout'
import type { DtModuleItem, DtNavItem } from '@/components/ui/layout'

import LogoIcon from '@/assets/icons/logo.svg'
import ServicesIcon from '@/assets/icons/services.svg'
import DocsIcon from '@/assets/icons/docs.svg'
import ReportsIcon from '@/assets/icons/reports.svg'

const store = useUserStore()
const { theme, setTheme } = useTheme()
const { locale, setLang } = useLangStorage()

const showProfile = ref(false)

const navItems: DtNavItem[] = [
  { to: '/services', icon: ServicesIcon, label: 'Services' },
  { to: '/documents', icon: DocsIcon, label: 'Documents' },
  { to: '/reports', icon: ReportsIcon, label: 'Reports' },
]

const modules: DtModuleItem[] = [
  { key: 'cabinet', label: 'Cabinet', icon: LogoIcon, href: 'https://id.dthub.uz/cabinet', span: 'full' },
  { key: 'services', label: 'Services', icon: ServicesIcon, href: '/services' },
  { key: 'documents', label: 'Documents', icon: DocsIcon, href: '/documents' },
  { key: 'reports', label: 'Reports', icon: ReportsIcon, href: '/reports' },
]
</script>

<template>
  <DtLayout>
    <template #header>
      <DtLayoutHeader
        badge="Specialist"
        :profile-name="store.user?.first_name + ' ' + store.user?.last_name"
        :profile-avatar="store.user?.logo_url"
        active-module="cabinet"
        :modules="modules"
        @toggle-profile="showProfile = !showProfile"
      >
        <template #logo>
          <RouterLink to="/"><LogoIcon /></RouterLink>
        </template>
        <template #profile-dropdown>
          <DtProfileModal
            v-model="showProfile"
            :user="store.user"
            :locale="locale"
            :theme="theme"
            :is-organization="store.isOrganization"
            profile-url="https://id.dthub.uz/cabinet"
            resource-url="https://resource.dthub.uz/api/file/view-image"
            @theme-change="setTheme"
            @locale-change="setLang"
            @logout="store.logout()"
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

## CSS Custom Properties

All layout components use `--dt-*` tokens from `base.css`. Key tokens:

| Property | Usage |
| ---------- | ------- |
| `--dt-sidebar-width` | Sidebar minimum width (240px). |
| `--dt-color-background` | Sidebar and header background. |
| `--dt-color-background-secondary` | Nav link hover background. |
| `--dt-color-background-tertiary` | Active nav link background. |
| `--dt-color-border` | Header button borders. |
| `--dt-color-border-light` | Sidebar divider, mobile top border. |
| `--dt-color-icon` | Nav item icon color. |
| `--dt-color-icon-dark` | Header button and profile modal icon color. |
| `--dt-color-accent` | Header button hover border, modal accent. |
| `--dt-color-surface` | Profile modal background. |
| `--dt-color-surface-hover` | Menu item hover, active theme option. |
| `--dt-color-divider` | Profile modal section dividers. |
| `--dt-radius-lg` | Nav link and profile modal border-radius (16px). |
| `--dt-radius-sm` | Menu item and option border-radius (9px). |
| `--dt-shadow-lg` | Profile modal shadow. |

## Responsive Breakpoints

| Breakpoint | Behavior |
| ----------- | ---------- |
| > 1024px | Sidebar: sticky left column. Header: 84px. |
| ≤ 1024px | Sidebar: fixed bottom nav. Header: 76px. Content: 80px bottom padding. |
| ≤ 768px | DtPageView: reduced padding, smaller title. |
