<script lang="ts" setup>
import { ref, provide, type Ref } from 'vue'

export type DtSidebarMobileMode = 'drawer' | 'bottom'

export interface DtLayoutSidebarContext {
  drawerOpen: Ref<boolean>
  mobileMode: Ref<DtSidebarMobileMode>
  registerMobileMode: (mode: DtSidebarMobileMode) => void
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const drawerOpen = ref(false)
const mobileMode = ref<DtSidebarMobileMode>('drawer')

provide('dt-layout-sidebar', {
  drawerOpen,
  mobileMode,
  registerMobileMode: (mode: DtSidebarMobileMode) => { mobileMode.value = mode },
  toggleDrawer: () => { drawerOpen.value = !drawerOpen.value },
  openDrawer: () => { drawerOpen.value = true },
  closeDrawer: () => { drawerOpen.value = false },
} satisfies DtLayoutSidebarContext)
</script>

<template>
  <div class="dt-layout">
    <header v-if="$slots.header" class="dt-layout__header">
      <slot name="header" />
    </header>
    <div class="dt-layout__main">
      <aside class="dt-layout__sidebar">
        <slot name="sidebar" />
      </aside>
      <main class="dt-layout__content">
        <slot />
      </main>
    </div>
    <footer v-if="$slots.footer" class="dt-layout__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.dt-layout {
  min-height: 100vh;
}

.dt-layout__header {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: var(--dt-color-background);
}

.dt-layout__main {
  display: grid;
  grid-template-areas: 'sidebar content';
  /* Fixed sidebar column so wide #top slot content doesn't grow the column
     (consumers can override --dt-sidebar-width). Content area gets the rest. */
  grid-template-columns: var(--dt-sidebar-width, 240px) 1fr;
}

.dt-layout__sidebar {
  grid-area: sidebar;
  position: relative;
}

.dt-layout__content {
  grid-area: content;
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .dt-layout__main {
    grid-template-areas: 'content';
    grid-template-columns: 1fr;
  }

  /* Sidebar self-positions on mobile (drawer or bottom-nav) */
  .dt-layout__sidebar {
    display: contents;
  }

  /* Edge gutter on mobile so router-view doesn't sit flush against the wall */
  .dt-layout__content {
    padding: 0 var(--dt-spacing-lg);
  }
}
</style>
