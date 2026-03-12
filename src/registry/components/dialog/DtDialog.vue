<script setup lang="ts">
import { provide, ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const internalOpen = ref(false)

const isOpen = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalOpen.value,
  set: (val: boolean) => {
    internalOpen.value = val
    emit('update:modelValue', val)
  },
})

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}

provide('dt-dialog', { isOpen, open, close, toggle })
</script>

<template>
  <slot :open="isOpen" :toggle="toggle" :close="close" />
</template>
