<script lang="ts" setup>
</script>

<template>
  <div class="dt-layout">
    <header class="dt-layout__header">
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
}

.dt-layout__main {
  display: grid;
  grid-template-areas: 'sidebar content';
  grid-auto-columns: minmax(var(--dt-sidebar-width, 240px), auto) 1fr;
}

.dt-layout__sidebar {
  grid-area: sidebar;
}

.dt-layout__content {
  grid-area: content;
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .dt-layout__main {
    grid-template-areas: 'content';
    grid-auto-columns: 1fr;
  }

  .dt-layout__sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
  }

  .dt-layout__content {
    padding-bottom: 80px;
  }
}
</style>
