<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenuRadioGroup } from 'reka-ui'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val ?? ''),
})
</script>

<template>
  <DropdownMenuRadioGroup v-model="value" class="dt-dropdown-radio-group">
    <slot />
  </DropdownMenuRadioGroup>
</template>

<style scoped>
.dt-dropdown-radio-group {
  display: flex;
  flex-direction: column;
}
</style>
