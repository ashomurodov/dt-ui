<script lang="ts" setup>
import { ref, computed, defineComponent, h, resolveComponent, Transition, watch } from 'vue'
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

const props = withDefaults(defineProps<{
  items: DtNavItem[]
  sections?: DtNavSection[]
  mobileItems?: number
  openKeys?: string[]
  defaultOpenKeys?: string[]
}>(), {
  mobileItems: 5,
  defaultOpenKeys: () => [],
})

const emit = defineEmits<{
  'update:openKeys': [keys: string[]]
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
  <div class="dt-sidebar">
    <!-- Desktop nav -->
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

    <!-- Mobile bottom nav -->
    <nav class="dt-sidebar__nav dt-sidebar__nav--mobile">
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
  --dt-sidebar-item-padding-x: var(--dt-space-4);
  --dt-sidebar-icon-size: 24px;
  --dt-sidebar-icon-center: 12px;
  --dt-sidebar-tree-offset: var(--dt-space-5);
  --dt-sidebar-tree-joint-y: 16px;
  --dt-sidebar-tree-parent-bridge: var(--dt-space-2);
  --dt-sidebar-tree-tail-trim: 6px;
  --dt-sidebar-sub-item-height: 32px;

  width: calc(222px + 24px);
  max-width: calc(222px + 24px);
  background-color: var(--dt-color-background);
  position: sticky;
  top: 84px;
  align-self: start;
  padding-left: 24px;
  margin: 0 calc(var(--dt-space-4) * -1);
  max-height: calc(100vh - 84px);
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
  gap: var(--dt-space-1);
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
  margin: var(--dt-space-2) 0;
}

/* Nav links */
.dt-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  padding: 10px var(--dt-sidebar-item-padding-x);
  border-radius: var(--dt-radius-lg);
  color: var(--dt-color-text);
  font-size: 15px;
  font-weight: 500;
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

.dt-sidebar__link.router-link-active {
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
  padding: 0 var(--dt-space-3);
  font-size: var(--dt-text-xs);
}

.dt-sidebar__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 20px;
  max-width: 56px;
  height: 20px;
  padding: 0 var(--dt-space-2);
  border-radius: var(--dt-radius-full);
  background-color: var(--dt-color-background-tertiary);
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-xs);
  font-weight: var(--dt-font-bold);
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-sidebar__link.router-link-active .dt-sidebar__badge,
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
  gap: var(--dt-space-1);
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
  margin-top: var(--dt-space-2);
}

.dt-sidebar__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-2) var(--dt-space-4);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-sm);
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
  font-size: var(--dt-text-xs);
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

/* Mobile */
@media (max-width: 1024px) {
  .dt-sidebar {
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
    margin: 0;
  }

  .dt-sidebar__nav--desktop {
    display: none;
  }

  .dt-sidebar__nav--mobile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: var(--dt-space-1-5);
    padding: var(--dt-space-2) var(--dt-space-2-5);
    width: 100%;
    max-width: 600px;
  }

  .dt-sidebar__nav--mobile .dt-sidebar__item {
    flex: 0 0 auto;
  }

  .dt-sidebar__nav--mobile .dt-sidebar__link {
    flex-direction: column;
    gap: var(--dt-space-1);
    padding: var(--dt-space-1-5);
    justify-content: center;
    align-items: center;
    border-radius: var(--dt-radius-sm);
    min-width: 60px;
    font-size: var(--dt-text-xs);
  }

  .dt-sidebar__nav--mobile .dt-sidebar__link-label,
  .dt-sidebar__nav--mobile .dt-sidebar__link span:not(.dt-sidebar__icon-slot):not(.dt-sidebar__badge) {
    max-width: 60px;
    text-align: center;
  }
}
</style>
