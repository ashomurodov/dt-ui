<script lang="ts" setup>
import { ref, computed, defineComponent, h, inject, resolveComponent, Transition, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { PropType } from 'vue'

export interface DtNavItem {
  key?: string
  to?: string | Record<string, any>
  icon?: any
  label: string
  badge?: string | number
  onClick?: (payload: DtSidebarItemClickPayload) => void | Promise<void>
  children?: DtNavItem[]
  active?: boolean
  disabled?: boolean
  hidden?: boolean
  defaultOpen?: boolean
}

export interface DtSidebarItemClickPayload {
  item: DtNavItem
  event: MouseEvent
  level: number
  parentKey?: string
}

export interface DtNavSection {
  title: string
  items: DtNavItem[]
  collapsible?: boolean
}

export type DtSidebarMobileMode = 'drawer' | 'bottom'

export interface DtSidebarContext {
  drawerOpen: Ref<boolean>
  mobileMode: Ref<DtSidebarMobileMode>
  registerMobileMode?: (mode: DtSidebarMobileMode) => void
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const props = withDefaults(defineProps<{
  items: DtNavItem[]
  sections?: DtNavSection[]
  mobileItems?: number
  mobileMode?: DtSidebarMobileMode
  defaultDrawerOpen?: boolean
  openKeys?: string[]
  defaultOpenKeys?: string[]
}>(), {
  mobileItems: 5,
  mobileMode: 'drawer',
  defaultDrawerOpen: false,
  defaultOpenKeys: () => [],
})

const emit = defineEmits<{
  'update:openKeys': [keys: string[]]
  'update:drawerOpen': [open: boolean]
  'item-click': [payload: DtSidebarItemClickPayload]
}>()

defineSlots<{
  top?: () => any
  bottom?: () => any
  'desktop-extra'?: () => any
  'mobile-extra'?: () => any
}>()

const sectionState = ref<Record<string, boolean>>({})

const isSectionOpen = (title: string) => {
  return sectionState.value[title] !== false
}

const toggleSection = (title: string) => {
  sectionState.value[title] = !isSectionOpen(title)
}

const getItemKey = (item: DtNavItem) => {
  if (item.key) return item.key
  if (typeof item.to === 'string') return item.to
  return item.label
}

const getVisibleItems = (items: DtNavItem[] = []) => {
  return items.filter((item) => !item.hidden)
}

const collectDefaultOpenKeys = (items: DtNavItem[] = []): string[] => {
  return items.flatMap((item) => {
    if (item.hidden) return []

    const childKeys = collectDefaultOpenKeys(item.children)
    if (item.defaultOpen && getVisibleItems(item.children).length) {
      return [getItemKey(item), ...childKeys]
    }

    return childKeys
  })
}

const allSectionItems = computed(() => {
  return props.sections?.flatMap((section) => section.items) ?? []
})

const getDefaultOpenKeys = () => {
  return Array.from(new Set([
    ...props.defaultOpenKeys,
    ...collectDefaultOpenKeys(props.items),
    ...collectDefaultOpenKeys(allSectionItems.value),
  ]))
}

const internalOpenKeys = ref<string[]>(getDefaultOpenKeys())

const isOpenControlled = computed(() => props.openKeys !== undefined)

const activeOpenKeys = computed(() => {
  return isOpenControlled.value ? props.openKeys ?? [] : internalOpenKeys.value
})

const setOpenKeys = (keys: string[]) => {
  const nextKeys = Array.from(new Set(keys))

  if (!isOpenControlled.value) {
    internalOpenKeys.value = nextKeys
  }

  emit('update:openKeys', nextKeys)
}

const isItemOpen = (key: string) => {
  return activeOpenKeys.value.includes(key)
}

const toggleItem = (key: string) => {
  if (isItemOpen(key)) {
    setOpenKeys(activeOpenKeys.value.filter((openKey) => openKey !== key))
    return
  }

  setOpenKeys([...activeOpenKeys.value, key])
}

// ── Drawer state ─────────────────────────────────
// When wrapped in DtLayout, drawer state lives in the layout context (so
// DtLayoutHeader's trigger can toggle it). When standalone, fall back to a
// local ref. The `drawerOpen` prop is no longer used to detect controlled
// mode because Vue coerces Boolean props to `false` when not passed, making
// `!== undefined` checks unreliable.
const layoutCtx = inject<DtSidebarContext | null>('dt-layout-sidebar', null)
const localDrawerOpen = ref(props.defaultDrawerOpen)

const drawerOpenValue = computed(() => {
  if (layoutCtx) return layoutCtx.drawerOpen.value
  return localDrawerOpen.value
})

const setDrawerOpen = (next: boolean) => {
  if (layoutCtx) {
    layoutCtx.drawerOpen.value = next
  } else {
    localDrawerOpen.value = next
  }
  emit('update:drawerOpen', next)
}

const openDrawer = () => setDrawerOpen(true)
const closeDrawer = () => setDrawerOpen(false)
const toggleDrawer = () => setDrawerOpen(!drawerOpenValue.value)

// Push the sidebar's mobileMode prop up to the layout so DtLayoutHeader can
// decide whether to render its hamburger trigger.
const syncMobileMode = (mode: DtSidebarMobileMode) => {
  layoutCtx?.registerMobileMode?.(mode)
}
syncMobileMode(props.mobileMode)
watch(() => props.mobileMode, syncMobileMode)

// Close drawer on Escape
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && drawerOpenValue.value) {
    closeDrawer()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})

const handleItemClick = (
  item: DtNavItem,
  event: MouseEvent,
  level: number,
  parentKey?: string,
) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  const payload = { item, event, level, parentKey }
  emit('item-click', payload)
  void item.onClick?.(payload)

  // Close drawer when navigating via a leaf item with a route target
  if (drawerOpenValue.value && item.to && !item.children?.length) {
    closeDrawer()
  }
}

watch(
  () => [props.items, props.sections, props.defaultOpenKeys],
  () => {
    if (isOpenControlled.value) return

    const defaults = getDefaultOpenKeys()
    const nextKeys = Array.from(new Set([...internalOpenKeys.value, ...defaults]))
    internalOpenKeys.value = nextKeys
  },
  { deep: true },
)

const visibleItems = computed(() => getVisibleItems(props.items))

const visibleSections = computed(() => {
  return props.sections
    ?.map((section) => ({ ...section, items: getVisibleItems(section.items) }))
    .filter((section) => section.items.length)
    ?? []
})

const mobileVisibleItems = computed(() => visibleItems.value.slice(0, props.mobileItems))

const sidebarClasses = computed(() => [
  'dt-sidebar',
  `dt-sidebar--${props.mobileMode}`,
  props.mobileMode === 'drawer' && drawerOpenValue.value && 'dt-sidebar--drawer-open',
])

const DtSidebarItem = defineComponent({
  name: 'DtSidebarItem',
  props: {
    item: {
      type: Object as PropType<DtNavItem>,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    parentKey: {
      type: String,
      required: false,
    },
    showChildren: {
      type: Boolean,
      default: true,
    },
    showBadge: {
      type: Boolean,
      default: true,
    },
  },
  setup(itemProps) {
    const renderIcon = () => {
      if (!itemProps.item.icon) return null

      return h('span', { class: 'dt-sidebar__icon-slot', 'aria-hidden': 'true' }, [
        h(itemProps.item.icon, { class: 'dt-sidebar__icon' }),
      ])
    }

    const renderChevron = (open: boolean) => {
      return h(
        'svg',
        {
          class: ['dt-sidebar__chevron', open && 'dt-sidebar__chevron--open'],
          width: '16',
          height: '16',
          viewBox: '0 0 16 16',
          fill: 'none',
          'aria-hidden': 'true',
        },
        [
          h('path', {
            d: 'M6 4L10 8L6 12',
            stroke: 'currentColor',
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        ],
      )
    }

    const renderBadge = () => {
      if (!itemProps.showBadge) return null

      const { badge } = itemProps.item

      if (badge === undefined || badge === null || badge === '') return null

      return h('span', { class: 'dt-sidebar__badge' }, String(badge))
    }

    const renderContent = (showChevron: boolean, open: boolean) => {
      const content = [
        renderIcon(),
        h('span', { class: 'dt-sidebar__link-label' }, itemProps.item.label),
      ]

      const badge = renderBadge()
      if (badge) {
        content.push(badge)
      }

      if (showChevron) {
        content.push(renderChevron(open))
      }

      return content
    }

    const renderControl = (childItems: DtNavItem[], open: boolean) => {
      const item = itemProps.item
      const itemKey = getItemKey(item)
      const hasChildren = itemProps.showChildren && childItems.length > 0
      const classes = [
        'dt-sidebar__link',
        itemProps.level > 0 && 'dt-sidebar__link--sub',
        hasChildren && 'dt-sidebar__link--parent',
        open && 'dt-sidebar__link--open',
        item.active && 'dt-sidebar__link--active',
        item.disabled && 'dt-sidebar__link--disabled',
      ]

      const onClick = (event: MouseEvent) => {
        if (item.disabled) {
          event.preventDefault()
          return
        }

        if (hasChildren) {
          toggleItem(itemKey)
        }

        handleItemClick(item, event, itemProps.level, itemProps.parentKey)
      }

      if (hasChildren || !item.to || item.disabled) {
        return h(
          'button',
          {
            type: 'button',
            class: classes,
            disabled: item.disabled,
            'aria-expanded': hasChildren ? String(open) : undefined,
            onClick,
          },
          renderContent(hasChildren, open),
        )
      }

      return h(
        resolveComponent('RouterLink'),
        {
          to: item.to,
          class: classes,
          onClick,
        },
        {
          default: () => renderContent(false, open),
        },
      )
    }

    return () => {
      const itemKey = getItemKey(itemProps.item)
      const childItems = getVisibleItems(itemProps.item.children)
      const hasChildren = itemProps.showChildren && childItems.length > 0
      const open = hasChildren && isItemOpen(itemKey)
      const control = renderControl(childItems, open)

      return h('div', { class: ['dt-sidebar__item', itemProps.level > 0 && 'dt-sidebar__item--nested'] }, [
        control,
        hasChildren
          ? h(
              Transition,
              { name: 'dt-collapse' },
              {
                default: () => open
                  ? h('div', { class: 'dt-sidebar__children' }, childItems.map((child) => h(DtSidebarItem, {
                      key: getItemKey(child),
                      item: child,
                      level: itemProps.level + 1,
                      parentKey: itemKey,
                      showChildren: true,
                    })))
                  : null,
              },
            )
          : null,
      ])
    }
  },
})
</script>

<template>
  <!-- Floating open trigger (mobile + drawer mode + drawer closed) -->
  <button
    v-if="mobileMode === 'drawer' && !drawerOpenValue"
    class="dt-sidebar-trigger"
    type="button"
    aria-label="Open navigation"
    @click="openDrawer"
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>

  <!-- Backdrop for drawer mode -->
  <Transition name="dt-sidebar-backdrop">
    <div
      v-if="mobileMode === 'drawer' && drawerOpenValue"
      class="dt-sidebar-backdrop"
      aria-hidden="true"
      @click="closeDrawer"
    />
  </Transition>

  <div :class="sidebarClasses">
    <!-- Drawer close button (mobile + drawer mode only — vertically aligned with first nav item) -->
    <button
      v-if="mobileMode === 'drawer'"
      class="dt-sidebar__close"
      type="button"
      aria-label="Close navigation"
      @click="closeDrawer"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Desktop / drawer nav -->
    <nav class="dt-sidebar__nav dt-sidebar__nav--desktop">
      <div v-if="$slots.top" class="dt-sidebar__slot dt-sidebar__slot--top">
        <slot name="top" />
      </div>

      <DtSidebarItem
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        :item="item"
        :level="0"
      />

      <template v-if="visibleSections.length">
        <div class="dt-sidebar__divider" />

        <div v-for="section in visibleSections" :key="section.title" class="dt-sidebar__section">
          <button
            v-if="section.collapsible !== false"
            class="dt-sidebar__section-header"
            @click="toggleSection(section.title)"
          >
            <span class="dt-sidebar__section-title">{{ section.title }}</span>
            <svg
              class="dt-sidebar__chevron"
              :class="{ 'dt-sidebar__chevron--open': isSectionOpen(section.title) }"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-else class="dt-sidebar__section-header dt-sidebar__section-header--static">
            <span class="dt-sidebar__section-title">{{ section.title }}</span>
          </div>

          <Transition name="dt-collapse">
            <div v-show="isSectionOpen(section.title)" class="dt-sidebar__section-items">
              <DtSidebarItem
                v-for="subItem in section.items"
                :key="getItemKey(subItem)"
                :item="subItem"
                :level="0"
              />
            </div>
          </Transition>
        </div>
      </template>

      <div v-if="$slots.bottom" class="dt-sidebar__slot dt-sidebar__slot--bottom">
        <slot name="bottom" />
      </div>

      <slot name="desktop-extra" />
    </nav>

    <!-- Mobile bottom nav (rendered only when mobileMode === 'bottom') -->
    <nav v-if="mobileMode === 'bottom'" class="dt-sidebar__nav dt-sidebar__nav--mobile">
      <DtSidebarItem
        v-for="item in mobileVisibleItems"
        :key="getItemKey(item)"
        :item="item"
        :level="0"
        :show-children="false"
        :show-badge="false"
      />
      <slot name="mobile-extra" />
    </nav>
  </div>
</template>

<style>
.dt-sidebar {
  --dt-sidebar-item-padding-x: var(--dt-spacing-xl);
  --dt-sidebar-icon-size: 24px;
  --dt-sidebar-icon-center: 12px;
  --dt-sidebar-tree-offset: var(--dt-spacing-2xl);
  --dt-sidebar-tree-joint-y: 16px;
  --dt-sidebar-tree-parent-bridge: var(--dt-spacing-md);
  --dt-sidebar-tree-tail-trim: 6px;
  --dt-sidebar-sub-item-height: 32px;

  width: var(--dt-sidebar-width);
  max-width: var(--dt-sidebar-width);
  background-color: var(--dt-color-background);
  position: sticky;
  top: var(--dt-header-height);
  align-self: start;
  padding-left: var(--dt-spacing-3xl);
  padding-bottom: var(--dt-spacing-3xl);
  margin: 0 calc(var(--dt-spacing-xl) * -1);
  max-height: calc(100vh - var(--dt-header-height));
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.dt-sidebar::-webkit-scrollbar {
  display: none;
}

/* Nav container */
.dt-sidebar__nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--dt-spacing-xs);
}

.dt-sidebar__nav--mobile {
  display: none;
}

.dt-sidebar__slot {
  min-width: 0;
}

.dt-sidebar__item {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dt-sidebar__item--nested {
  position: relative;
}

/* Divider */
.dt-sidebar__divider {
  height: 1px;
  background-color: var(--dt-color-border-light);
  margin: var(--dt-spacing-md) 0;
}

/* Nav links */
.dt-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--dt-spacing-lg);
  padding: 10px var(--dt-sidebar-item-padding-x);
  border-radius: var(--dt-radius-lg);
  color: var(--dt-color-text);
  font-size: var(--dt-text-body-sm);
  font-weight: 400;
  transition: background-color var(--dt-transition-fast);
  text-decoration: none;
  min-width: 0;
  width: 100%;
  background: none;
  border: 0;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
}

.dt-sidebar__link-label,
.dt-sidebar__link span:not(.dt-sidebar__icon-slot):not(.dt-sidebar__badge) {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-sidebar__link:hover {
  background-color: var(--dt-color-background-secondary);
}

.dt-sidebar__link.router-link-exact-active {
  background-color: var(--dt-color-background-tertiary);
}

.dt-sidebar__link--active {
  background-color: var(--dt-color-background-tertiary);
}

.dt-sidebar__link--disabled,
.dt-sidebar__link:disabled {
  color: var(--dt-color-text-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

.dt-sidebar__link--disabled:hover,
.dt-sidebar__link:disabled:hover {
  background-color: transparent;
}

.dt-sidebar__link--sub {
  height: var(--dt-sidebar-sub-item-height);
  min-height: var(--dt-sidebar-sub-item-height);
  padding: 0 var(--dt-spacing-lg);
  font-size: var(--dt-text-body-xs);
}

.dt-sidebar__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 20px;
  max-width: 56px;
  height: 20px;
  padding: 0 var(--dt-spacing-md);
  border-radius: var(--dt-radius-full);
  background-color: var(--dt-color-background-tertiary);
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-body-xs);
  font-weight: var(--dt-font-bold);
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-sidebar__link.router-link-exact-active .dt-sidebar__badge,
.dt-sidebar__link--active .dt-sidebar__badge {
  background-color: var(--dt-color-accent-light);
  color: var(--dt-color-accent);
}

.dt-sidebar__link--disabled .dt-sidebar__badge,
.dt-sidebar__link:disabled .dt-sidebar__badge {
  background-color: var(--dt-color-disabled-bg);
  color: var(--dt-color-disabled-text);
}

.dt-sidebar__children {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-xs);
  margin-left: calc(var(--dt-sidebar-item-padding-x) + var(--dt-sidebar-icon-center));
  padding-left: var(--dt-sidebar-tree-offset);
  overflow: visible;
}

.dt-sidebar__children::before {
  content: '';
  position: absolute;
  top: calc(var(--dt-sidebar-tree-parent-bridge) * -1);
  bottom: calc(var(--dt-sidebar-sub-item-height) - var(--dt-sidebar-tree-joint-y) + var(--dt-sidebar-tree-tail-trim));
  left: 0;
  width: 1px;
  background-color: var(--dt-color-border);
  pointer-events: none;
}

.dt-sidebar__children > .dt-sidebar__item--nested::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(var(--dt-sidebar-tree-offset) * -1);
  width: var(--dt-sidebar-tree-offset);
  height: var(--dt-sidebar-tree-joint-y);
  border-bottom: 1px solid var(--dt-color-border);
  border-left: 1px solid var(--dt-color-border);
  border-bottom-left-radius: 10px;
  pointer-events: none;
}

/* Icons */
.dt-sidebar__icon-slot {
  width: var(--dt-sidebar-icon-size);
  height: var(--dt-sidebar-icon-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 var(--dt-sidebar-icon-size);
}

.dt-sidebar__icon {
  width: var(--dt-sidebar-icon-size);
  height: var(--dt-sidebar-icon-size);
  color: var(--dt-color-icon);
  flex-shrink: 0;
  display: block;
  stroke-width: var(--dt-sidebar-icon-stroke-width);
}

.dt-sidebar__icon :where([stroke]) {
  stroke-width: var(--dt-sidebar-icon-stroke-width);
}

/* Collapsible sections */
.dt-sidebar__section {
  display: flex;
  flex-direction: column;
  margin-top: var(--dt-spacing-md);
}

.dt-sidebar__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-spacing-md) var(--dt-spacing-xl);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-body-sm);
  font-weight: 500;
  font-family: inherit;
  transition: color var(--dt-transition-fast);
}

.dt-sidebar__section-header:hover {
  color: var(--dt-color-text);
}

.dt-sidebar__section-header--static {
  cursor: default;
}

.dt-sidebar__section-title {
  font-size: var(--dt-text-body-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dt-sidebar__section-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.dt-sidebar__chevron {
  width: 16px;
  height: 16px;
  margin-left: auto;
  transition: transform var(--dt-transition-fast);
  flex-shrink: 0;
  color: var(--dt-color-icon-secondary);
}

.dt-sidebar__chevron--open {
  transform: rotate(90deg);
}

/* Collapse transition */
.dt-collapse-enter-active,
.dt-collapse-leave-active {
  transition: all var(--dt-transition-base);
  max-height: 500px;
}

.dt-collapse-enter-from,
.dt-collapse-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

/* Floating open trigger (mobile only, drawer mode, drawer closed) */
.dt-sidebar-trigger {
  display: none;
  position: fixed;
  top: var(--dt-header-height-mobile);
  left: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-icon-dark);
  cursor: pointer;
  z-index: 35;
  transition: background-color var(--dt-transition-fast);
}

.dt-sidebar-trigger:hover,
.dt-sidebar-trigger:focus-visible {
  background: var(--dt-color-background-secondary);
  outline: none;
}

.dt-sidebar-trigger svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .dt-sidebar-trigger {
    display: inline-flex;
  }
}

/* Drawer close button (rendered only inside .dt-sidebar--drawer, vertically aligned with first nav item) */
.dt-sidebar__close {
  display: none;
  position: absolute;
  /* Drawer padding-top (16px) + half of (link height 40 − button height 32) = 20px → centers on first nav item */
  top: var(--dt-spacing-2xl);
  right: var(--dt-spacing-lg);
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-color-background);
  color: var(--dt-color-icon-dark);
  cursor: pointer;
  z-index: 1;
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

.dt-sidebar__close:hover,
.dt-sidebar__close:focus-visible {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-border-hover);
  outline: none;
}

.dt-sidebar__close svg {
  width: 18px;
  height: 18px;
}

/* Backdrop (drawer mode only) */
.dt-sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 39;
  background-color: var(--dt-color-overlay);
}

.dt-sidebar-backdrop-enter-active,
.dt-sidebar-backdrop-leave-active {
  transition: opacity var(--dt-transition-base);
}

.dt-sidebar-backdrop-enter-from,
.dt-sidebar-backdrop-leave-to {
  opacity: 0;
}

/* ── Mobile (≤1024px) ────────────────────────── */
@media (max-width: 1024px) {
  /* Drawer mode (default): off-canvas left, slide-in. The drawer itself does
     NOT scroll — the inner nav does. That keeps the absolutely-positioned
     close button outside the scroll area, so it stays pinned. */
  .dt-sidebar--drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    max-width: 80vw;
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    z-index: 40;
    margin: 0;
    padding: 0;
    border-right: 1px solid var(--dt-color-border-light);
    transform: translateX(-100%);
    transition: transform var(--dt-transition-base);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dt-sidebar--drawer.dt-sidebar--drawer-open {
    transform: translateX(0);
  }

  .dt-sidebar--drawer .dt-sidebar__nav--desktop {
    display: flex;
    flex: 1;
    overflow-y: auto;
    padding: var(--dt-spacing-xl) var(--dt-spacing-lg);
    padding-bottom: var(--dt-spacing-3xl);
    scrollbar-width: none;
  }

  .dt-sidebar--drawer .dt-sidebar__nav--desktop::-webkit-scrollbar {
    display: none;
  }

  .dt-sidebar--drawer .dt-sidebar__close {
    display: inline-flex;
  }

  /* Bottom mode (opt-in): horizontal bar at bottom */
  .dt-sidebar--bottom {
    top: unset;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: unset;
    overflow-y: visible;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 40;
    display: flex;
    justify-content: center;
    background-color: var(--dt-color-background);
    border-top: 1px solid var(--dt-color-border-light);
    padding-left: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .dt-sidebar--bottom .dt-sidebar__nav--desktop {
    display: none;
  }

  .dt-sidebar--bottom .dt-sidebar__nav--mobile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: var(--dt-spacing-sm);
    padding: var(--dt-spacing-md) var(--dt-spacing-lg);
    width: 100%;
    max-width: 600px;
  }

  .dt-sidebar--bottom .dt-sidebar__nav--mobile .dt-sidebar__item {
    flex: 0 0 auto;
  }

  .dt-sidebar--bottom .dt-sidebar__nav--mobile .dt-sidebar__link {
    flex-direction: column;
    gap: var(--dt-spacing-xs);
    padding: var(--dt-spacing-sm);
    justify-content: center;
    align-items: center;
    border-radius: var(--dt-radius-xs);
    min-width: 60px;
    font-size: var(--dt-text-body-xs);
  }

  .dt-sidebar--bottom .dt-sidebar__nav--mobile .dt-sidebar__link-label,
  .dt-sidebar--bottom .dt-sidebar__nav--mobile .dt-sidebar__link span:not(.dt-sidebar__icon-slot):not(.dt-sidebar__badge) {
    max-width: 60px;
    text-align: center;
  }
}
</style>
