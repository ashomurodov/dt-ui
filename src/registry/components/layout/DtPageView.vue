<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string
  maxWidth?: string
}>(), {
  maxWidth: '1100px',
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
  padding: var(--dt-space-6);
  padding-bottom: var(--dt-space-12);
  margin: 0 auto;
}

.dt-page-view__title {
  font-size: 32px;
  font-weight: 700;
  color: var(--dt-color-text);
  margin: 0 0 24px 0;
}

@media (max-width: 768px) {
  .dt-page-view {
    padding: var(--dt-space-4);
  }

  .dt-page-view__title {
    font-size: var(--dt-text-2xl);
    margin-bottom: var(--dt-space-4);
  }
}
</style>
