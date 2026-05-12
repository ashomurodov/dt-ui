<script setup lang="ts">
import { computed } from 'vue'
import DtAvatar from './DtAvatar.vue'
import DtAvatarAdd from './DtAvatarAdd.vue'

export type AvatarGroupSize = 'xs' | 'sm' | 'md'

export interface AvatarGroupUser {
  src?: string
  alt?: string
  name?: string
  initials?: string
}

const props = withDefaults(defineProps<{
  users?: AvatarGroupUser[]
  max?: number
  size?: AvatarGroupSize
  showAdd?: boolean
  addAriaLabel?: string
}>(), {
  size: 'md',
  showAdd: false,
  addAriaLabel: 'Add member',
})

defineEmits<{
  add: []
}>()

const visibleUsers = computed(() => {
  if (!props.users) return []
  return props.max != null ? props.users.slice(0, props.max) : props.users
})

const overflow = computed(() => {
  if (!props.users || props.max == null) return 0
  return Math.max(0, props.users.length - props.max)
})
</script>

<template>
  <div class="dt-avatar-group" :class="`dt-avatar-group--${size}`">
    <div class="dt-avatar-group__stack">
      <!-- Data-driven path -->
      <DtAvatar
        v-for="(u, i) in visibleUsers"
        :key="i"
        :src="u.src"
        :alt="u.alt"
        :name="u.name"
        :initials="u.initials"
        :size="size"
      />
      <DtAvatar
        v-if="overflow > 0"
        :initials="`+${overflow}`"
        :size="size"
        :alt="`${overflow} more`"
      />

      <!-- Or slot-based: consumer provides DtAvatar children directly -->
      <slot />
    </div>
    <DtAvatarAdd
      v-if="showAdd"
      :size="size"
      :aria-label="addAriaLabel"
      @click="$emit('add')"
    />
  </div>
</template>

<style scoped>
.dt-avatar-group {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-md);
}

.dt-avatar-group__stack {
  display: inline-flex;
  align-items: center;
}

/* Stacked avatars: white halo + negative margin so they overlap. */
.dt-avatar-group__stack :deep(.dt-avatar) {
  box-shadow: 0 0 0 1.5px var(--dt-color-background);
  background: var(--dt-color-background); /* opaque so halo stays clean */
}

.dt-avatar-group--xs .dt-avatar-group__stack :deep(.dt-avatar:not(:first-child)) { margin-left: -4px; }
.dt-avatar-group--sm .dt-avatar-group__stack :deep(.dt-avatar:not(:first-child)) { margin-left: -8px; }
.dt-avatar-group--md .dt-avatar-group__stack :deep(.dt-avatar:not(:first-child)) { margin-left: -12px; }
</style>
