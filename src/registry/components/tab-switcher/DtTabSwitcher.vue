<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

export interface DtTab {
  key: string
  label: string
  badge?: string
}

const props = defineProps<{
  tabs: DtTab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const ready = ref(false)

const setIndicator = (left: number, width: number) => {
  const el = indicatorRef.value
  if (!el) return
  el.style.left = left + 'px'
  el.style.width = width + 'px'
}

const animateIndicator = (newLeft: number, newWidth: number) => {
  const el = indicatorRef.value
  const container = containerRef.value
  if (!el || !container || !ready.value) {
    setIndicator(newLeft, newWidth)
    ready.value = true
    return
  }

  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const curLeft = elRect.left - containerRect.left
  const curWidth = elRect.width

  el.style.transition = 'none'
  setIndicator(newLeft, newWidth)

  const dx = curLeft - newLeft
  const sx = curWidth / newWidth
  el.style.transform = `translateX(${dx}px) scaleX(${sx})`

  void el.offsetWidth

  el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.transform = 'translateX(0) scaleX(1)'
}

const syncIndicator = (animate = false) => {
  const container = containerRef.value
  if (!container) return
  const buttons = container.querySelectorAll<HTMLElement>('.dt-tab-switcher__btn')
  const idx = props.tabs.findIndex((t) => t.key === props.modelValue)
  const btn = buttons[idx]
  if (!btn) return

  if (animate) {
    animateIndicator(btn.offsetLeft, btn.offsetWidth)
  } else {
    const el = indicatorRef.value
    if (!el) return
    el.style.transition = 'none'
    el.style.transform = ''
    setIndicator(btn.offsetLeft, btn.offsetWidth)
    ready.value = true
  }
}

let clickHandled = false

const onTabClick = (key: string, e: MouseEvent) => {
  const btn = e.currentTarget as HTMLElement
  if (btn) {
    animateIndicator(btn.offsetLeft, btn.offsetWidth)
  }
  clickHandled = true
  emit('update:modelValue', key)
}

watch(() => props.modelValue, () => {
  if (clickHandled) {
    clickHandled = false
    return
  }
  syncIndicator(true)
})

let ro: ResizeObserver | null = null

onMounted(() => {
  syncIndicator(false)
  ro = new ResizeObserver(() => syncIndicator(false))
  if (containerRef.value) ro.observe(containerRef.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="dt-tab-switcher">
    <div ref="indicatorRef" class="dt-tab-switcher__indicator" />
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="dt-tab-switcher__btn"
      :class="{ 'dt-tab-switcher__btn--active': modelValue === tab.key }"
      @click="onTabClick(tab.key, $event)"
    >
      {{ tab.label }}
      <span v-if="tab.badge" class="dt-tab-switcher__badge">{{ tab.badge }}</span>
    </button>
  </div>
</template>

<style scoped>
.dt-tab-switcher {
  display: inline-flex;
  align-items: center;
  position: relative;
  background: var(--dt-color-background-tertiary);
  border-radius: var(--dt-radius-md);
  padding: 4px;
}

.dt-tab-switcher__indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  background: var(--dt-color-text);
  border-radius: var(--dt-radius-sm);
  z-index: 0;
  transform-origin: left;
  will-change: transform;
}

.dt-tab-switcher__btn {
  position: relative;
  z-index: 1;
  padding: 10px 20px;
  border: none;
  border-radius: var(--dt-radius-sm);
  font-size: var(--dt-text-body-sm);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: color var(--dt-transition-fast);
  background: transparent;
  color: var(--dt-color-text-secondary);
  white-space: nowrap;
}

.dt-tab-switcher__btn:hover {
  color: var(--dt-color-text);
}

.dt-tab-switcher__btn--active {
  color: var(--dt-color-background);
}

.dt-tab-switcher__btn--active:hover {
  color: var(--dt-color-background);
}

.dt-tab-switcher__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: var(--dt-radius-xs);
  font-size: var(--dt-text-body-xs);
  font-weight: 700;
  margin-left: 4px;
  background: var(--dt-color-error-light);
  color: var(--dt-color-error);
  transition: background var(--dt-transition-fast), color var(--dt-transition-fast);
}

.dt-tab-switcher__btn--active .dt-tab-switcher__badge {
  background: var(--dt-color-error);
  color: var(--dt-color-white);
}
</style>
