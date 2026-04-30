<script setup lang="ts">
import { computed, ref } from 'vue'
import { DialogRoot } from 'reka-ui'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  defaultOpen?: boolean
  modal?: boolean
}>(), {
  modelValue: undefined,
  defaultOpen: false,
  modal: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const internalOpen = ref(props.defaultOpen)

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
</script>

<template>
  <DialogRoot
    :open="isOpen"
    :modal="modal"
    @update:open="isOpen = $event"
  >
    <slot :open="isOpen" :toggle="toggle" :close="close" :open-dialog="open" />
  </DialogRoot>
</template>
