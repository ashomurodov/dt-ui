<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string
  maxWidth?: string
}>(), {
  maxWidth: '1280px',
})
</script>

<template>
  <div class="dt-page-view" :style="{ maxWidth }">
    <h1 v-if="title" class="dt-page-view__title">{{ title }}</h1>
    <slot name="title" />
    <slot />
  </div>
</template>

<style scoped>
.dt-page-view {
  padding: var(--dt-spacing-3xl);
  padding-bottom: var(--dt-spacing-6xl);
  margin: 0 auto;
}

.dt-page-view__title {
  font-size: var(--dt-text-xl);
  font-weight: 700;
  color: var(--dt-color-text);
  margin: 0 0 var(--dt-spacing-3xl) 0;
}

@media (max-width: 768px) {
  .dt-page-view {
    padding: var(--dt-spacing-xl);
  }

  .dt-page-view__title {
    font-size: var(--dt-text-2xl);
    margin-bottom: var(--dt-spacing-xl);
  }
}
</style>
