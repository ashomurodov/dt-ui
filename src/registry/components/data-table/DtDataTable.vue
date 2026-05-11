<script lang="ts" setup>
export interface DtColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'right' | 'center'
  hideOnMobile?: boolean
}

defineProps<{
  columns: DtColumn[]
  items: unknown[]
  loading?: boolean
  emptyText?: string
  page?: number
  pageSize?: number
  striped?: boolean
}>()

defineSlots<{
  [key: string]: (props: { item: any; index: number; rowIndex: number }) => any
}>()

const getRowIndex = (index: number, page?: number, pageSize?: number) => {
  return index + 1 + ((page || 1) - 1) * (pageSize || 10)
}
</script>

<template>
  <div class="dt-data-table-wrap">
    <table class="dt-data-table" :class="{ 'dt-data-table--striped': striped }">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[`dt-col-${col.key}`, { 'dt-hide-mobile': col.hideOnMobile }]"
            :style="{ width: col.width, textAlign: col.align }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="dt-data-table__loading">
            <div class="dt-data-table__spinner" />
          </td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td :colspan="columns.length" class="dt-data-table__empty">
            {{ emptyText }}
          </td>
        </tr>
        <template v-else>
          <tr v-for="(item, index) in items" :key="index" class="dt-data-table__row">
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[`dt-col-${col.key}`, { 'dt-hide-mobile': col.hideOnMobile }]"
              :style="{ textAlign: col.align }"
            >
              <slot
                :name="col.key"
                :item="item"
                :index="index"
                :rowIndex="getRowIndex(index, page, pageSize)"
              >
                {{ (item as any)[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dt-data-table-wrap {
  overflow-x: auto;
}

.dt-data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 6px;
}

.dt-data-table thead th {
  font-size: var(--dt-text-body-xs);
  font-weight: 500;
  color: var(--dt-color-icon-secondary);
  text-align: left;
  padding: 8px 12px;
  white-space: nowrap;
}

.dt-data-table__row {
  background: var(--dt-color-background);
  border-radius: var(--dt-radius-lg);
  transition: background var(--dt-transition-fast);
}

.dt-data-table__row:hover {
  background: var(--dt-color-background-secondary);
}

.dt-data-table--striped .dt-data-table__row:nth-child(even) {
  background: var(--dt-color-background-tertiary);
}

.dt-data-table--striped .dt-data-table__row:nth-child(even):hover {
  background: var(--dt-color-background-secondary);
}

.dt-data-table__row td {
  padding: 6px 12px;
  vertical-align: middle;
  font-size: var(--dt-text-body-xs);
  color: var(--dt-color-text);
}

.dt-data-table__row td:first-child {
  border-radius: var(--dt-radius-lg) 0 0 var(--dt-radius-lg);
}

.dt-data-table__row td:last-child {
  border-radius: 0 var(--dt-radius-lg) var(--dt-radius-lg) 0;
}

.dt-data-table__loading,
.dt-data-table__empty {
  text-align: center;
  padding: 48px 12px !important;
  color: var(--dt-color-text-tertiary);
  font-size: var(--dt-text-body-sm);
}

.dt-data-table__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--dt-color-border-light);
  border-top-color: var(--dt-color-accent);
  border-radius: 50%;
  margin: 0 auto;
  animation: dt-table-spin 0.8s linear infinite;
}

@keyframes dt-table-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .dt-hide-mobile {
    display: none;
  }
}
</style>
