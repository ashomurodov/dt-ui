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

// Build page items with stable 5-page window
// Near start:  1 2 3 4 5 ... 50
// Middle:      1 ... 14 15 16 17 18 ... 50
// Near end:    1 ... 46 47 48 49 50
const pageItems = computed(() => {
  const total = totalPages.value
  const current = props.page
  const items: (number | 'ellipsis')[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i)
    return items
  }

  // Near start — pin first 5
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) items.push(i)
    items.push('ellipsis')
    items.push(total)
    return items
  }

  // Near end — pin last 5
  if (current >= total - 3) {
    items.push(1)
    items.push('ellipsis')
    for (let i = total - 4; i <= total; i++) items.push(i)
    return items
  }

  // Middle — show window of 5 around current
  items.push(1)
  items.push('ellipsis')
  for (let i = current - 2; i <= current + 2; i++) items.push(i)
  items.push('ellipsis')
  items.push(total)
  return items
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
    <template v-for="(item, idx) in pageItems" :key="idx">
      <span v-if="item === 'ellipsis'" class="dt-pagination__ellipsis">...</span>
      <button
        v-else
        class="dt-pagination__btn"
        :class="{ 'dt-pagination__btn--active': item === page }"
        @click="changePage(item)"
      >
        {{ item }}
      </button>
    </template>
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
.dt-pagination__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  color: var(--dt-gray-400);
  font-size: var(--dt-text-sm);
  user-select: none;
  letter-spacing: 2px;
}

.dt-pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--dt-spacing-3xl);
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
  border-radius: var(--dt-radius-sm);
}

.dt-pagination--md .dt-pagination__btn {
  min-width: 36px;
  height: 36px;
  border-radius: var(--dt-radius-sm);
}

.dt-pagination--sm .dt-pagination__btn {
  min-width: 32px;
  height: 32px;
  border-radius: var(--dt-radius-xxs);
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
  color: var(--dt-color-white);
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
  color: var(--dt-color-white);
}

.dt-pagination--primary .dt-pagination__btn:disabled {
  background: var(--dt-gray-100);
  color: var(--dt-gray-300);
  cursor: not-allowed;
}
</style>
