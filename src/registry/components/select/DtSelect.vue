<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { SelectRoot } from 'reka-ui'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  name?: string
  required?: boolean
}>(), {
  placeholder: 'Select an option...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const internalValue = ref<string | number | null>(props.defaultValue ?? null)

const value = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalValue.value,
  set: (next: string | number | null | undefined) => {
    const value = next ?? null
    internalValue.value = value
    emit('update:modelValue', value)
  },
})

provide('dt-select', {
  placeholder: computed(() => props.placeholder),
})
</script>

<template>
  <div class="dt-select" :class="{ 'dt-select--disabled': disabled }" v-bind="$attrs">
    <SelectRoot
      v-model="value"
      :default-value="defaultValue"
      :disabled="disabled"
      :name="name"
      :required="required"
    >
      <slot />
    </SelectRoot>
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
