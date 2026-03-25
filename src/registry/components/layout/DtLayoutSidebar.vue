<script lang="ts" setup>
import { ref, computed } from 'vue'

export interface DtNavItem {
  to: string
  icon?: object
  label: string
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
}>(), {
  mobileItems: 5,
})

const sectionState = ref<Record<string, boolean>>({})

const isSectionOpen = (title: string) => {
  return sectionState.value[title] !== false
}

const toggleSection = (title: string) => {
  sectionState.value[title] = !isSectionOpen(title)
}

const mobileVisibleItems = computed(() => props.items.slice(0, props.mobileItems))
</script>

<template>
  <div class="dt-sidebar">
    <!-- Desktop nav -->
    <nav class="dt-sidebar__nav dt-sidebar__nav--desktop">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="dt-sidebar__link"
      >
        <component v-if="item.icon" :is="item.icon" class="dt-sidebar__icon" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <template v-if="sections?.length">
        <div class="dt-sidebar__divider" />

        <div v-for="section in sections" :key="section.title" class="dt-sidebar__section">
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
              <RouterLink
                v-for="subItem in section.items"
                :key="subItem.to"
                :to="subItem.to"
                class="dt-sidebar__link dt-sidebar__link--sub"
              >
                <component v-if="subItem.icon" :is="subItem.icon" class="dt-sidebar__icon" />
                <span>{{ subItem.label }}</span>
              </RouterLink>
            </div>
          </Transition>
        </div>
      </template>

      <slot name="desktop-extra" />
    </nav>

    <!-- Mobile bottom nav -->
    <nav class="dt-sidebar__nav dt-sidebar__nav--mobile">
      <RouterLink
        v-for="item in mobileVisibleItems"
        :key="item.to"
        :to="item.to"
        class="dt-sidebar__link"
      >
        <component v-if="item.icon" :is="item.icon" class="dt-sidebar__icon" />
        <span class="dt-sidebar__label">{{ item.label }}</span>
      </RouterLink>
      <slot name="mobile-extra" />
    </nav>
  </div>
</template>

<style scoped>
.dt-sidebar {
  width: calc(222px + 24px);
  max-width: calc(222px + 24px);
  background-color: var(--dt-color-background);
  position: sticky;
  top: 8px;
  align-self: start;
  padding-left: 24px;
  max-height: calc(100vh - 8px);
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
  padding: 10px var(--dt-space-4);
  border-radius: var(--dt-radius-lg);
  color: var(--dt-color-text);
  font-size: 15px;
  font-weight: 500;
  transition: background-color var(--dt-transition-fast);
  text-decoration: none;
  min-width: 0;
}

.dt-sidebar__link span {
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

.dt-sidebar__link--sub {
  padding: var(--dt-space-2) var(--dt-space-4);
  font-size: var(--dt-text-xs);
}

/* Icons */
.dt-sidebar__icon {
  width: 24px;
  height: 24px;
  color: var(--dt-color-icon);
  flex-shrink: 0;
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

  .dt-sidebar__nav--mobile .dt-sidebar__link span {
    max-width: 60px;
    text-align: center;
  }
}
</style>
