# dt-ui

Vue 3 UI components for DT ecosystem modules.

`dt-ui` is a copy-based component registry, similar in spirit to shadcn. You install the package for the CLI and registry, then copy the components you need into your project. After that, the component files live in your app and can be customized by your team.

**Vue 3 + TypeScript** | **Copy-based registry** | **Design tokens** | **Dark mode** | **Accessible primitives**

## Why Copy-Based?

Company microservices need the same UI language, but every product still needs room for local business rules. `dt-ui` gives you:

- Shared defaults for spacing, colors, layout, tables, forms, and modals.
- Local component ownership after install.
- TypeScript-friendly APIs.
- Components that are easy to inspect, change, and commit in each service.
- A predictable update flow through the `dt-ui` CLI.

## Quick Start

Install the package:

```bash
npm install aetherx-dt-ui
```

Initialize the project:

```bash
npx dt-ui init
```

Add the components you need:

```bash
npx dt-ui add button input select layout
```

Import the generated styles once in `src/main.ts`:

```ts
import '@/styles/base.css'
import '@/styles/table-cells.css'
```

Use copied components from your local app:

```vue
<script setup lang="ts">
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <DtButton>Create</DtButton>
</template>
```

## CLI Commands

```bash
npx dt-ui init
npx dt-ui list
npx dt-ui add button
npx dt-ui add button input select
npx dt-ui add layout
npx dt-ui update
```

`init` creates the local config, styles, and helper files.

`add` copies component source into `src/components/ui`.

`update` refreshes registry-managed files. It should ask before overwriting component files that may contain local edits.

## Project Setup

Make sure your Vue app has the `@` alias configured.

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

For SVG icon imports, create or update `src/env.d.ts`:

```ts
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```

## Components

```bash
npx dt-ui list
```

| Component | Install | Description |
| --- | --- | --- |
| `DtButton` | `add button` | Button variants, sizes, loading state, icon slots |
| `DtInput` | `add input` | Input with label, hint, error, success, sizes |
| `DtSelect` | `add select` | Select with trigger, content, items, keyboard support |
| `DtToggle` | `add toggle` | Switch toggle in multiple sizes |
| `DtCheckbox` | `add checkbox` | Checkbox with label and size variants |
| `DtRadio` | `add radio` | Radio button and radio group patterns |
| `DtBadge` | `add badge` | Color badges with optional dot |
| `DtStatusBadge` | `add status-badge` | Semantic entity status pills |
| `DtCard` | `add card` | Card, header, content, footer |
| `DtDialog` | `add dialog` | Accessible modal primitives |
| `DtDataTable` | `add data-table` | Slot-based data table with loading and empty states |
| `DtPagination` | `add pagination` | Pagination with page window and ellipsis |
| `DtTabSwitcher` | `add tab-switcher` | Tab switcher with active indicator and badges |
| `DtSearchToolbar` | `add search-toolbar` | Search input with action button |
| `DtLayout` | `add layout` | App shell, header, sidebar, profile modal, page view, divider |

## Import Pattern

Each component folder has its own `index.ts`.

```ts
import { DtButton } from '@/components/ui/button'
import { DtInput } from '@/components/ui/input'
import { DtSelect, DtSelectTrigger, DtSelectContent, DtSelectItem } from '@/components/ui/select'
```

Layout exports components and useful types:

```ts
import {
  DtLayout,
  DtLayoutHeader,
  DtLayoutSidebar,
  DtPageView,
  DtProfileModal,
  type DtNavItem,
  type DtNavSection,
  type DtSidebarItemClickPayload,
} from '@/components/ui/layout'
```

## Basic Components

### Button

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { DtButton } from '@/components/ui/button'

const saving = ref(false)
</script>

<template>
  <DtButton size="md" variant="primary">
    <template #icon-left>
      <Plus :size="18" />
    </template>
    Create
  </DtButton>

  <DtButton variant="outline" :loading="saving">
    Save
  </DtButton>
</template>
```

### Input

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtInput } from '@/components/ui/input'

const search = ref('')
</script>

<template>
  <DtInput
    v-model="search"
    placeholder="Search documents"
    size="md"
  >
    <template #label>Search</template>
  </DtInput>
</template>
```

### Select

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtSelect,
  DtSelectTrigger,
  DtSelectContent,
  DtSelectItem,
} from '@/components/ui/select'

const status = ref<string | number | null>(null)
</script>

<template>
  <DtSelect v-model="status" placeholder="Choose status">
    <DtSelectTrigger />
    <DtSelectContent>
      <DtSelectItem value="published">Published</DtSelectItem>
      <DtSelectItem value="inactive">Inactive</DtSelectItem>
      <DtSelectItem value="moderation">In moderation</DtSelectItem>
    </DtSelectContent>
  </DtSelect>
</template>
```

### Dialog

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DtDialog,
  DtDialogTrigger,
  DtDialogContent,
  DtDialogHeader,
  DtDialogFooter,
} from '@/components/ui/dialog'
import { DtButton } from '@/components/ui/button'

const open = ref(false)
</script>

<template>
  <DtDialog v-model="open">
    <DtDialogTrigger>
      <DtButton>Create</DtButton>
    </DtDialogTrigger>

    <DtDialogContent>
      <DtDialogHeader>
        <h2>Create item</h2>
        <p>Fill the form and save.</p>
      </DtDialogHeader>

      <!-- form fields -->

      <DtDialogFooter>
        <DtButton variant="outline" @click="open = false">Cancel</DtButton>
        <DtButton>Save</DtButton>
      </DtDialogFooter>
    </DtDialogContent>
  </DtDialog>
</template>
```

## App Shell

Install the full layout system:

```bash
npx dt-ui add layout
```

Add the DT modules modal assets to `index.html`:

```html
<script src="https://cdn.dthub.uz/dt-header/dist/dt-header.js"></script>
<link rel="stylesheet" href="https://cdn.dthub.uz/dt-header/dist/style.css">
```

Example app shell:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Home, FileText } from 'lucide-vue-next'
import {
  DtLayout,
  DtLayoutHeader,
  DtLayoutSidebar,
  DtProfileModal,
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

function logout() {
  // Clear auth and redirect from your app.
}
</script>

<template>
  <DtLayout>
    <template #header>
      <DtLayoutHeader
        badge="CRM"
        active-module="crm"
        :profile-name="user.first_name + ' ' + user.last_name"
        @toggle-profile="showProfile = !showProfile"
      >
        <template #logo>
          <RouterLink to="/">Logo</RouterLink>
        </template>

        <template #profile-dropdown>
          <DtProfileModal
            v-model="showProfile"
            :user="user"
            @logout="logout"
          />
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

## Sidebar API

The sidebar supports simple route links, action rows, badges, disabled/hidden rows, sections, and expandable parent items.

If an item has `children`, it renders as an expandable parent button. Parent route navigation is intentionally not mixed into that same row; put the route on a child item for v1.

Use exported types for editor hints:

```ts
import { ref } from 'vue'
import type {
  DtNavItem,
  DtNavSection,
  DtSidebarItemClickPayload,
} from '@/components/ui/layout'
```

`DtNavItem` fields:

| Field | Type | Notes |
| --- | --- | --- |
| `key` | `string` | Recommended for dynamic items and action rows |
| `to` | `string \| Record<string, any>` | Passed to `RouterLink` for route navigation |
| `label` | `string` | Visible item label |
| `icon` | `any` | Vue component, for example from `lucide-vue-next` |
| `badge` | `string \| number` | Count/status badge on the right side |
| `onClick` | `(payload) => void \| Promise<void>` | Use for modal openers and custom actions |
| `children` | `DtNavItem[]` | Makes the item an expandable parent |
| `active` | `boolean` | Force active state when route matching is not enough |
| `disabled` | `boolean` | Prevents navigation, toggle, and callbacks |
| `hidden` | `boolean` | Skips rendering |
| `defaultOpen` | `boolean` | Opens this parent by default |

Badges render in the desktop sidebar. Mobile bottom navigation intentionally omits badges to keep the compact nav clean.

Typed nav items:

```ts
import { FileText, Grid2x2, Plus } from 'lucide-vue-next'

const openKeys = ref<string[]>(['deals'])

function openCreateDealModal() {
  // Open your product modal here.
}

const navItems: DtNavItem[] = [
  {
    key: 'deals',
    label: 'Deals',
    icon: Grid2x2,
    badge: 3,
    defaultOpen: true,
    children: [
      {
        key: 'deal-test',
        label: 'test',
        badge: 3,
        to: { path: '/documents', query: { deal: 'test' } },
      },
      {
        key: 'add-deal',
        label: 'Add',
        icon: Plus,
        onClick: () => openCreateDealModal(),
      },
    ],
  },
  {
    key: 'open-profile',
    label: 'Open profile',
    icon: FileText,
    onClick: ({ item }: DtSidebarItemClickPayload) => {
      console.log(item.label)
    },
  },
]
```

Sections:

```ts
const sections: DtNavSection[] = [
  {
    title: 'Widgets',
    items: [
      { key: 'components', label: 'Components', to: '/components' },
      { key: 'disabled', label: 'Disabled action', disabled: true, badge: 'Soon' },
    ],
  },
]
```

Usage:

```vue
<DtLayoutSidebar
  v-model:open-keys="openKeys"
  :items="navItems"
  :sections="sections"
  :mobile-items="4"
  @item-click="handleSidebarClick"
/>
```

Click handling:

```ts
function handleSidebarClick(payload: DtSidebarItemClickPayload) {
  console.log(payload.item.label, payload.level, payload.parentKey)
}
```

Reactive updates are normal Vue updates. If you push a child into `children` or replace the `items` array from modal submit logic, the sidebar renders it immediately. Put the route in the new item's `to` field when the new sidebar row should navigate.

### Sidebar Slots

Use slots when a product needs custom content above or below the generated nav.

```vue
<DtLayoutSidebar :items="navItems" :sections="sections">
  <template #top>
    <WorkspaceSwitcher
      :workspace="workspace"
      @change="openWorkspaceModal"
    />
  </template>

  <template #bottom>
    <SidebarFooter :version="appVersion" />
  </template>
</DtLayoutSidebar>
```

Existing compatibility slots still work:

```vue
<template #desktop-extra>
  <!-- legacy desktop-only extra content -->
</template>

<template #mobile-extra>
  <!-- mobile bottom-nav extra content -->
</template>
```

## List Page Pattern

This is the common DT module page shape: page title, tabs, search/action toolbar, table, pagination.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DtPageView, DtDivider } from '@/components/ui/layout'
import { DtTabSwitcher, type DtTab } from '@/components/ui/tab-switcher'
import { DtSearchToolbar } from '@/components/ui/search-toolbar'
import { DtDataTable, type DtColumn } from '@/components/ui/data-table'
import { DtPagination } from '@/components/ui/pagination'
import { DtStatusBadge, type StatusVariant } from '@/components/ui/status-badge'

const page = ref(1)
const search = ref('')
const activeTab = ref('all')
const loading = ref(false)
const totalCount = ref(2)

const tabs: DtTab[] = [
  { key: 'all', label: 'All documents' },
  { key: 'published', label: 'Published' },
  { key: 'inactive', label: 'Inactive' },
]

type DocumentItem = {
  no: number
  name: string
  status: StatusVariant
  statusLabel: string
}

const documents = ref<DocumentItem[]>([
  { no: 1, name: 'Contract', status: 'active', statusLabel: 'Active' },
  { no: 2, name: 'Invoice', status: 'moderation', statusLabel: 'In moderation' },
])

const columns: DtColumn[] = [
  { key: 'no', label: 'No', width: '64px' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

function createDocument() {
  // Open your product modal here.
}

function fetchDocuments() {
  // Call your API here.
}

function editDocument(item: DocumentItem) {
  console.log(item.name)
}
</script>

<template>
  <DtPageView title="Documents">
    <DtTabSwitcher v-model="activeTab" :tabs="tabs" />

    <DtSearchToolbar
      v-model:search="search"
      add-label="Create"
      @add="createDocument"
      @search="fetchDocuments"
    />

    <DtDivider />

    <DtDataTable
      :columns="columns"
      :items="documents"
      :loading="loading"
      :page="page"
      :page-size="10"
      empty-text="No documents found"
    >
      <template #status="{ item }">
        <DtStatusBadge :variant="item.status">
          {{ item.statusLabel }}
        </DtStatusBadge>
      </template>

      <template #actions="{ item }">
        <button @click="editDocument(item)">Edit</button>
      </template>
    </DtDataTable>

    <DtPagination
      v-model:page="page"
      :total-count="totalCount"
      :page-size="10"
    />
  </DtPageView>
</template>
```

## Design Tokens

All components use CSS custom properties from `base.css`.

Color scales:

```css
--dt-brand-100 ... --dt-brand-900
--dt-gray-100 ... --dt-gray-900
--dt-success-100 ... --dt-success-900
--dt-error-100 ... --dt-error-900
--dt-warning-100 ... --dt-warning-900
--dt-blue-100 ... --dt-blue-900
--dt-yellow-100 ... --dt-yellow-900
```

Semantic tokens:

```css
--dt-color-accent: var(--dt-brand-500);
--dt-color-text: var(--dt-gray-900);
--dt-color-border: var(--dt-gray-200);
--dt-color-success: var(--dt-success-600);
--dt-color-error: var(--dt-error-500);
```

Use tokens for product-specific overrides:

```css
:root {
  --dt-color-accent: #0096b2;
  --dt-sidebar-width: 240px;
}
```

### Dark Mode

Set `data-theme="dark"` on `html`:

```ts
document.documentElement.dataset.theme = 'dark'
```

Use `data-theme="light"` or remove the attribute to return to light mode, depending on your app theme strategy.

## Updating Components

Install the latest package:

```bash
npm install aetherx-dt-ui@latest
```

Update generated files:

```bash
npx dt-ui update
```

The CLI should keep local ownership in mind:

- Shared styles and helper files can be refreshed.
- Component files may ask before overwrite.
- If you customized a copied component, review the diff before accepting an overwrite.

To refresh a single component manually, remove it from `.dtui.json` and run `add` again:

```bash
npx dt-ui add layout
```

## TypeScript Notes

Many component folders export useful types:

```ts
import type { DtNavItem, DtNavSection } from '@/components/ui/layout'
import type { DtColumn } from '@/components/ui/data-table'
```

Prefer typing configuration arrays:

```ts
const items: DtNavItem[] = []
const columns: DtColumn[] = []
```

This gives autocomplete for valid fields and catches invalid values early.

## Tech Stack

- Vue 3 Composition API
- TypeScript
- Pure CSS custom properties
- Reka UI for behavior-heavy primitives such as Dialog and Select
- Compatible with Vue Router and Vite
- Works well with `lucide-vue-next` or SVG icon components

## Troubleshooting

### Styles look missing

Make sure these are imported in `main.ts`:

```ts
import '@/styles/base.css'
import '@/styles/table-cells.css'
```

### TypeScript cannot resolve `@/...`

Check `tsconfig.app.json` and Vite alias setup.

### Sidebar routes do not navigate

`to` is rendered through `RouterLink`, so your app must use Vue Router. For non-route rows, use `onClick`.

### Icons do not render

Pass Vue components as `icon`, for example from `lucide-vue-next`, or configure SVG imports with `vite-svg-loader`.

## License

MIT
