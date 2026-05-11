<script setup lang="ts">
import { computed } from 'vue'

export type RadioSize = 'lg' | 'md' | 'sm'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  value: string | number
  size?: RadioSize
  disabled?: boolean
  name?: string
}>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isSelected = computed(() => props.modelValue === props.value)

const select = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}

const classes = computed(() => [
  'dt-radio',
  `dt-radio--${props.size}`,
  isSelected.value && 'dt-radio--selected',
  props.disabled && 'dt-radio--disabled',
].filter(Boolean))
</script>

<template>
  <label :class="classes">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isSelected"
      :disabled="disabled"
      class="dt-radio__input"
      @change="select"
    />
    <span class="dt-radio__circle">
      <span v-if="isSelected" class="dt-radio__dot" />
    </span>
    <span v-if="$slots.default" class="dt-radio__label">
      <slot />
    </span>
  </label>
</template>

<style scoped>
.dt-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-md);
  cursor: pointer;
  user-select: none;
}

.dt-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.dt-radio__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--dt-gray-200);
  transition: background-color var(--dt-transition-base);
  flex-shrink: 0;
}

.dt-radio:hover:not(.dt-radio--disabled) .dt-radio__circle {
  background: var(--dt-gray-300);
}

.dt-radio--selected .dt-radio__circle {
  background: var(--dt-color-accent);
}

.dt-radio--selected:hover:not(.dt-radio--disabled) .dt-radio__circle {
  background: var(--dt-color-accent-hover);
}

.dt-radio__dot {
  border-radius: 50%;
  background: var(--dt-color-white);
  animation: dt-radio-pop 0.2s ease;
}

/* Sizes */
.dt-radio--lg .dt-radio__circle {
  width: 24px;
  height: 24px;
}
.dt-radio--lg .dt-radio__dot {
  width: 10px;
  height: 10px;
}

.dt-radio--md .dt-radio__circle {
  width: 20px;
  height: 20px;
}
.dt-radio--md .dt-radio__dot {
  width: 8px;
  height: 8px;
}

.dt-radio--sm .dt-radio__circle {
  width: 16px;
  height: 16px;
}
.dt-radio--sm .dt-radio__dot {
  width: 6px;
  height: 6px;
}

.dt-radio__label {
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text);
}

/* Disabled */
.dt-radio--disabled {
  cursor: not-allowed;
}
.dt-radio--disabled .dt-radio__circle {
  background: var(--dt-gray-100);
}
.dt-radio--disabled .dt-radio__label {
  color: var(--dt-color-disabled-text);
}

/* Focus */
.dt-radio__input:focus-visible + .dt-radio__circle {
  outline: 2px solid var(--dt-color-ring);
  outline-offset: 2px;
}

@keyframes dt-radio-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
