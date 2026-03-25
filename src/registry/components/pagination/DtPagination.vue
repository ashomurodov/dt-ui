<script lang="ts" setup>
import { computed } from 'vue'

export type PaginationVariant = 'primary' | 'secondary'
export type PaginationSize = 'lg' | 'md' | 'sm'

const props = withDefaults(defineProps<{
  page: number
  totalCount: number
  pageSize?: number
  variant?: PaginationVariant
  size?: PaginationSize
}>(), {
  pageSize: 10,
  variant: 'secondary',
  size: 'md',
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

const classes = computed(() => [
  'dt-pagination',
  `dt-pagination--${props.variant}`,
  `dt-pagination--${props.size}`,
])
</script>

<template>
  <div v-if="totalPages > 1" :class="classes">
    <button
      class="dt-pagination__btn"
      :disabled="page === 1"
      @click="changePage(page - 1)"
    >
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
    <button
      class="dt-pagination__btn"
      :disabled="page === totalPages"
      @click="changePage(page + 1)"
    >
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
  padding: 12px 16px;
  border: none;
  background: none;
  color: var(--dt-gray-500);
  font-size: var(--dt-text-sm);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--dt-transition-fast);
}

/* ── Sizes ───────────────────────────────── */
.dt-pagination--lg .dt-pagination__btn {
  min-width: 40px;
  height: 40px;
  border-radius: var(--dt-radius-md);
}

.dt-pagination--md .dt-pagination__btn {
  min-width: 36px;
  height: 36px;
  border-radius: var(--dt-radius-md);
}

.dt-pagination--sm .dt-pagination__btn {
  min-width: 32px;
  height: 32px;
  border-radius: var(--dt-radius-xs);
}

/* ── Secondary variant (bordered, dark active) ── */
.dt-pagination--secondary .dt-pagination__btn {
  background: var(--dt-color-background);
  border: 1px solid var(--dt-color-border);
}

.dt-pagination--secondary .dt-pagination__btn:hover:not(:disabled):not(.dt-pagination__btn--active) {
  background: var(--dt-gray-100);
  color: var(--dt-gray-800);
}

.dt-pagination--secondary .dt-pagination__btn--active {
  background: var(--dt-gray-800);
  border-color: var(--dt-gray-800);
  color: #ffffff;
}

.dt-pagination--secondary .dt-pagination__btn:disabled {
  background: var(--dt-gray-100);
  border-color: var(--dt-color-border);
  color: var(--dt-gray-300);
  cursor: not-allowed;
}

/* ── Primary variant (no border, accent active) ── */
.dt-pagination--primary .dt-pagination__btn {
  background: var(--dt-color-background);
  border: none;
}

.dt-pagination--primary .dt-pagination__btn:hover:not(:disabled):not(.dt-pagination__btn--active) {
  background: var(--dt-gray-100);
  color: var(--dt-gray-800);
}

.dt-pagination--primary .dt-pagination__btn--active {
  background: var(--dt-color-accent);
  color: #ffffff;
}

.dt-pagination--primary .dt-pagination__btn:disabled {
  background: var(--dt-gray-100);
  color: var(--dt-gray-300);
  cursor: not-allowed;
}
</style>
