<script setup lang="ts">
import { provide, ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: null,
  placeholder: 'Select an option...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const isOpen = ref(false)
const search = ref('')
const highlightedIndex = ref(-1)
const items = ref<Array<{ value: string | number; label: string; disabled?: boolean }>>([])
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const item = items.value.find(i => i.value === props.modelValue)
  return item?.label ?? ''
})

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(i => i.label.toLowerCase().includes(q))
})

function open() {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = -1
  search.value = ''
}

function close() {
  isOpen.value = false
  search.value = ''
}

function toggle() {
  isOpen.value ? close() : open()
}

function select(value: string | number) {
  emit('update:modelValue', value)
  close()
}

function registerItem(item: { value: string | number; label: string; disabled?: boolean }) {
  const exists = items.value.find(i => i.value === item.value)
  if (!exists) {
    items.value.push(item)
  }
}

function unregisterItem(value: string | number) {
  items.value = items.value.filter(i => i.value !== value)
}

provide('dt-select', {
  isOpen,
  selectedValue: computed(() => props.modelValue),
  highlightedIndex,
  filteredItems,
  search,
  triggerRef,
  contentRef,
  open,
  close,
  toggle,
  select,
  registerItem,
  unregisterItem,
})
</script>

<template>
  <div class="dt-select" :class="{ 'dt-select--disabled': disabled }" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.dt-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.dt-select--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
