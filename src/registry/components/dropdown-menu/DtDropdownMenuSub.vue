<script setup lang="ts">
import { computed, ref } from 'vue'
import { DropdownMenuSub } from 'reka-ui'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  defaultOpen?: boolean
}>(), {
  modelValue: undefined,
  defaultOpen: false,
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
</script>

<template>
  <DropdownMenuSub :open="isOpen" @update:open="isOpen = $event">
    <slot />
  </DropdownMenuSub>
</template>
