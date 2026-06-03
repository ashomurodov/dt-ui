# Layout

The app shell. A bundle of components for composing a typical DT module: sticky header, sidebar with nested nav, modules switcher, profile dropdown, page view container, and a divider helper.

```bash
npx dt-ui add layout
```

Installs `DtLayout`, `DtLayoutHeader`, `DtLayoutSidebar`, `DtModulesModal`, `DtProfileModal`, `DtPageView`, and `DtDivider` in a single folder.

## App Shell

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Home, FileText } from 'lucide-vue-next'
import {
  DtLayout,
  DtLayoutHeader,
  DtLayoutSidebar,
  DtProfileModal,
  type DtModuleItem,
  type DtNavItem,
  type DtUser,
} from '@/components/ui/layout'

const showProfile = ref(false)

const user: DtUser = {
  first_name: 'John',
  last_name: 'Doe',
  phone_numbers: [{ number: '+998 90 000 00 00' }],
}

const navItems: DtNavItem[] = [
  { key: 'dashboard', to: '/', icon: Home, label: 'Dashboard' },
  { key: 'documents', to: '/documents', icon: FileText, label: 'Documents', badge: 12 },
]

const modules: DtModuleItem[] = [
  { key: 'crm', label: 'CRM', icon: Home, href: '/crm' },
  { key: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
]

function logout() {
  // clear auth
}
</script>

<template>
  <DtLayout>
    <template #header>
      <DtLayoutHeader
        badge="CRM"
        active-module="crm"
        :modules="modules"
        :profile-name="`${user.first_name} ${user.last_name}`"
        @toggle-profile="showProfile = !showProfile"
      >
        <template #logo>
          <RouterLink to="/">Logo</RouterLink>
        </template>
        <template #profile-dropdown>
          <DtProfileModal v-model="showProfile" :user="user" @logout="logout" />
        </template>
      </DtLayoutHeader>
    </template>

    <template #sidebar>
      <DtLayoutSidebar :items="navItems" />
    </template>

    <RouterView />
  </DtLayout>
</template>
```

## Profile modal

`DtProfileModal` is the avatar/name dropdown with built-in Appearance and Language sub-views. Each view slides in with a direction-aware animation (forward = from the right, back = from the left) — only the incoming panel animates, so navigation stays snappy.

### Switch account

Provide the `#switch-account` slot and the modal automatically adds a **Switch account** menu item that opens an in-popover sub-view rendering your slot (e.g. the account list). No `menu-items` wiring needed.

```vue
<DtProfileModal v-model="showProfile" :user="user" @logout="logout" @open-switch-account="loadAccounts">
  <template #switch-account="{ back, close }">
    <AccountList @switched="close" />
  </template>
</DtProfileModal>
```

| API | Type | Notes |
| --- | --- | --- |
| `#switch-account` slot | `{ back, close }` | When present, shows the Switch-account menu item + sub-view. Slot props let the list trigger navigation/close. |
| `@open-switch-account` | `() => void` | Emitted when the sub-view opens — use to lazy-load accounts. |
| `resource-url` | `string` | Base for avatar **keys**; absolute `http(s)` `logo_url` values are used as-is. |

The avatar falls back to initials derived from the **displayed** name (organization name in a company context, the user's name otherwise).

## Sidebar

`DtLayoutSidebar` supports route links, action rows, badges, disabled/hidden rows, sections, and expandable parent items.

| Field | Type | Notes |
| ------- | ------ | ------- |
| `key` | `string` | Recommended for dynamic items and action rows |
| `to` | `string \| Record<string, any>` | Passed to `RouterLink` for route navigation |
| `label` | `string` | Visible item label |
| `icon` | `any` | Vue component, e.g. from `lucide-vue-next` |
| `badge` | `string \| number` | Count/status badge on the right |
| `onClick` | `(payload) => void \| Promise<void>` | Use for modal openers and custom actions |
| `children` | `DtNavItem[]` | Makes the item an expandable parent |
| `active` | `boolean` | Force active state |
| `disabled` | `boolean` | Prevents navigation, toggle, and callbacks |
| `hidden` | `boolean` | Skips rendering |
| `defaultOpen` | `boolean` | Opens this parent by default |

If an item has `children`, it renders as an expandable parent button. Don't mix routing with `children` on the same row — put the route on a child instead.

### Sidebar Slots

```vue
<DtLayoutSidebar :items="navItems">
  <template #top>
    <WorkspaceSwitcher />
  </template>
  <template #bottom>
    <SidebarFooter />
  </template>
</DtLayoutSidebar>
```

Mobile bottom-nav intentionally omits badges to keep the compact nav clean.

## Header Modules Modal

`DtLayoutHeader` opens `DtModulesModal` automatically when `modules` has visible items. Hide the button entirely with `:show-modules-button="false"`.

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

- Pass `href` for normal navigation.
- Pass `onClick` without `href` for custom app-owned behavior.
- Listen to `@module-click` for analytics, auth guards, or custom routing. Call `payload.event.preventDefault()` to stop the default navigation.

## Page View

`DtPageView` is a thin container with a title slot and consistent padding for list pages. `DtDivider` is a horizontal rule that respects theme tokens.

```vue
<DtPageView title="Documents">
  <DtTabSwitcher v-model="activeTab" :tabs="tabs" />
  <DtSearchToolbar v-model:search="search" />
  <DtDivider />
  <DtDataTable :columns="columns" :items="items" />
</DtPageView>
```

## Theming

The sidebar reads layout tokens from `base.css`:

| Token | Default | Description |
| ------- | --------- | ------------- |
| `--dt-sidebar-width` | `240px` | Desktop sidebar width |
| `--dt-sidebar-collapsed` | `72px` | Reserved for future collapse mode |
| `--dt-sidebar-icon-stroke-width` | `2` | Stroke width for nav icons |
