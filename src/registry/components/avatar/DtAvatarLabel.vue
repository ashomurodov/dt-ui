<script setup lang="ts">
import { computed } from 'vue'
import DtAvatar, { type AvatarSize, type AvatarStatus } from './DtAvatar.vue'

export type AvatarLabelSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  name: string
  description?: string
  size?: AvatarLabelSize
  src?: string
  alt?: string
  initials?: string
  status?: AvatarStatus | null
  bordered?: boolean
}>(), {
  size: 'md',
  status: null,
  bordered: false,
})

const avatarSize = computed<AvatarSize>(() => {
  if (props.size === 'sm') return 'sm'
  if (props.size === 'lg') return 'lg'
  return 'md'
})
</script>

<template>
  <div class="dt-avatar-label" :class="`dt-avatar-label--${size}`">
    <slot name="avatar" :size="avatarSize">
      <DtAvatar
        :src="src"
        :alt="alt"
        :name="name"
        :initials="initials"
        :size="avatarSize"
        :status="status"
        :bordered="bordered"
      />
    </slot>
    <div class="dt-avatar-label__text">
      <span class="dt-avatar-label__name">{{ name }}</span>
      <span v-if="$slots.description || description" class="dt-avatar-label__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dt-avatar-label {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-spacing-md);
}

.dt-avatar-label__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dt-avatar-label__name {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-bold);
  color: var(--dt-color-text);
  line-height: 1.25;
}

.dt-avatar-label__description {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-regular);
  color: var(--dt-color-text-secondary);
  line-height: 1.25;
}

.dt-avatar-label--sm .dt-avatar-label__name        { font-size: var(--dt-text-body-md);  line-height: var(--dt-leading-body-md); }
.dt-avatar-label--sm .dt-avatar-label__description { font-size: var(--dt-text-body-sm);  line-height: var(--dt-leading-body-sm); }

.dt-avatar-label--md .dt-avatar-label__name        { font-size: var(--dt-text-body-md);  line-height: var(--dt-leading-body-md); }
.dt-avatar-label--md .dt-avatar-label__description { font-size: var(--dt-text-body-md);  line-height: var(--dt-leading-body-md); }

.dt-avatar-label--lg .dt-avatar-label__name        { font-size: 20px; line-height: 24px; }
.dt-avatar-label--lg .dt-avatar-label__description { font-size: 20px; line-height: 24px; }
</style>
