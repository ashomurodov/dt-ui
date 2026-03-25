<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  badge?: string
  profileName?: string
  profileAvatar?: string
  showModulesButton?: boolean
}>(), {
  showModulesButton: true,
})

defineEmits<{
  'toggle-profile': []
  'open-modules': []
}>()

const profileInitials = computed(() => {
  if (!props.profileName) return ''
  const parts = props.profileName.trim().split(/\s+/)
  return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<template>
  <div class="dt-header">
    <div class="dt-header__logo-group">
      <slot name="logo" />
      <span v-if="badge" class="dt-header__badge">{{ badge }}</span>
    </div>

    <div class="dt-header__actions">
      <slot name="actions" />

      <button
        v-if="showModulesButton"
        class="dt-header__circle-btn"
        @click="$emit('open-modules')"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>

      <button class="dt-header__circle-btn" @click="$emit('toggle-profile')">
        <img v-if="profileAvatar" class="dt-header__avatar" :src="profileAvatar" alt="" />
        <div v-else class="dt-header__avatar dt-header__avatar--initials">
          {{ profileInitials }}
        </div>
      </button>

      <slot name="profile-dropdown" />
    </div>
  </div>
</template>

<style scoped>
.dt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 var(--dt-space-6);
  background-color: transparent;
}

.dt-header__logo-group {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
}

.dt-header__badge {
  display: inline-flex;
  align-items: center;
  padding: var(--dt-space-1) var(--dt-space-2);
  border-radius: 2px 8px 2px 8px;
  background: linear-gradient(270deg, #cceaf0 0%, #ccf0e4 100%);
  color: #005a6b;
  font-size: var(--dt-text-xs);
  font-weight: 500;
  line-height: 14px;
  white-space: nowrap;
}

.dt-header__actions {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  position: relative;
}

.dt-header__circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--dt-color-border);
  background: transparent;
  cursor: pointer;
  transition: all var(--dt-transition-fast);
  padding: 0;
}

.dt-header__circle-btn svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--dt-color-icon-dark);
}

.dt-header__circle-btn:hover {
  border-color: var(--dt-color-accent);
  background: var(--dt-color-surface-hover);
}

.dt-header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.dt-header__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: var(--dt-color-background-secondary);
  color: var(--dt-color-text);
  letter-spacing: 0.02em;
}

@media (max-width: 1024px) {
  .dt-header {
    height: 76px;
  }
}
</style>
