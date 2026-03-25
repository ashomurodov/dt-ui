<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  page: number
  totalCount: number
  pageSize?: number
}>(), {
  pageSize: 10,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.page
  const pages: number[] = []
  const start = Math.max(1, current - 1)
  const end = Math.min(total, start + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const changePage = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  emit('update:page', p)
}
</script>

<template>
  <div v-if="totalPages > 1" class="dt-pagination">
    <button class="dt-pagination__btn" :disabled="page === 1" @click="changePage(page - 1)">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button
      v-for="p in visiblePages"
      :key="p"
      class="dt-pagination__btn"
      :class="{ 'dt-pagination__btn--active': p === page }"
      @click="changePage(p)"
    >
      {{ p }}
    </button>
    <button class="dt-pagination__btn" :disabled="page === totalPages" @click="changePage(page + 1)">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.dt-pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--dt-space-6);
}

.dt-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--dt-radius-md);
  background: none;
  color: var(--dt-color-text);
  font-size: var(--dt-text-base);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--dt-transition-fast);
}

.dt-pagination__btn:hover:not(:disabled) {
  background: var(--dt-color-background-secondary);
}

.dt-pagination__btn--active {
  background: var(--dt-color-accent);
  color: #ffffff;
}

.dt-pagination__btn--active:hover {
  background: var(--dt-color-accent-hover);
}

.dt-pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
