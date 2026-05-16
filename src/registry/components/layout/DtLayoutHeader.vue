<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import DtModulesModal, { type DtModuleClickPayload, type DtModuleItem } from './DtModulesModal.vue'
import type { DtSidebarContext } from './DtLayoutSidebar.vue'

const props = withDefaults(defineProps<{
  badge?: string
  profileName?: string
  profileAvatar?: string
  activeModule?: string
  envMode?: 'dev' | 'preprod' | 'prod'
  showModulesButton?: boolean
  showProfileButton?: boolean
  showMobileTrigger?: boolean
  modules?: DtModuleItem[]
  modulesTitle?: string
  modulesDescription?: string
  modulesCloseLabel?: string
}>(), {
  activeModule: 'cabinet',
  envMode: 'dev',
  showModulesButton: true,
  showProfileButton: true,
  showMobileTrigger: true,
  modules: () => [],
  modulesTitle: 'Modules',
  modulesDescription: '',
  modulesCloseLabel: 'Close modules',
})

const emit = defineEmits<{
  'toggle-profile': []
  'modules-click': [event: MouseEvent]
  'module-click': [payload: DtModuleClickPayload]
}>()

const showModulesModal = ref(false)

const profileInitials = computed(() => {
  if (!props.profileName) return ''
  const parts = props.profileName.trim().split(/\s+/)
  return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2)
})

const hasModules = computed(() => props.modules.some((item) => !item.hidden))

const openModules = (event: MouseEvent) => {
  emit('modules-click', event)
  if (hasModules.value) {
    showModulesModal.value = true
  }
}

const sidebarCtx = inject<DtSidebarContext | null>('dt-layout-sidebar', null)

const showHamburger = computed(() => {
  if (!props.showMobileTrigger) return false
  if (!sidebarCtx) return false
  return sidebarCtx.mobileMode.value === 'drawer'
})

const onHamburgerClick = () => {
  sidebarCtx?.toggleDrawer()
}
</script>

<template>
  <div class="dt-header">
    <div class="dt-header__logo-group">
      <button
        v-if="showHamburger"
        class="dt-header__mobile-trigger"
        type="button"
        :aria-expanded="sidebarCtx?.drawerOpen.value ? 'true' : 'false'"
        aria-label="Open navigation"
        @click="onHamburgerClick"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <slot name="logo" />
      <span v-if="badge" class="dt-header__badge">{{ badge }}</span>
    </div>

    <div class="dt-header__actions">
      <slot name="actions" />

      <button
        v-if="showModulesButton"
        class="dt-header__action-btn dt-header__action-btn--modules"
        type="button"
        @click="openModules"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M17 18C17 18.5523 17.4477 19 18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17C5.44772 17 5 17.4477 5 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 12C17 12.5523 17.4477 13 18 13C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11C17.4477 11 17 11.4477 17 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 12C5 12.5523 5.44772 13 6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5C17.4477 5 17 5.44772 17 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 6C5 6.55228 5.44772 7 6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div v-if="showProfileButton" class="dt-header__profile-wrapper">
        <button
          class="dt-header__action-btn dt-header__profile-trigger"
          @click="$emit('toggle-profile')"
        >
          <img v-if="profileAvatar" class="dt-header__avatar" :src="profileAvatar" alt="" />
          <div v-else class="dt-header__avatar dt-header__avatar--initials">
            {{ profileInitials }}
          </div>
        </button>

        <slot name="profile-dropdown" />
      </div>

      <DtModulesModal
        v-if="hasModules"
        v-model="showModulesModal"
        :modules="modules"
        :active-module="activeModule"
        :title="modulesTitle"
        :description="modulesDescription"
        :close-label="modulesCloseLabel"
        @module-click="emit('module-click', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.dt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--dt-header-height);
  padding: 0 var(--dt-spacing-3xl);
  background-color: transparent;
}

.dt-header__logo-group {
  display: flex;
  align-items: center;
  gap: var(--dt-spacing-md);
}

.dt-header__mobile-trigger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-color-background);
  color: var(--dt-color-icon-dark);
  cursor: pointer;
  transition: background-color var(--dt-transition-fast),
    border-color var(--dt-transition-fast);
}

.dt-header__mobile-trigger:hover,
.dt-header__mobile-trigger:focus-visible {
  background: var(--dt-color-background-secondary);
  border-color: var(--dt-color-border-hover);
  outline: none;
}

.dt-header__mobile-trigger svg {
  width: 20px;
  height: 20px;
}

.dt-header__badge {
  display: inline-flex;
  align-items: center;
  padding: var(--dt-spacing-xs) var(--dt-spacing-md);
  border-radius: 2px 8px 2px 8px;
  background: linear-gradient(270deg, var(--dt-brand-100) 0%, var(--dt-success-100) 100%);
  color: var(--dt-brand-700);
  font-size: var(--dt-text-body-xs);
  font-weight: var(--dt-font-medium);
  line-height: var(--dt-leading-body-xs);
  white-space: nowrap;
}

.dt-header__actions {
  display: flex;
  align-items: center;
  gap: var(--dt-spacing-md);
  position: relative;
  padding: 4px;
  border: 1px solid var(--dt-color-border-light);
  border-radius: 999px;
  background: var(--dt-color-background);
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
}

.dt-header__action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all var(--dt-transition-fast);
  padding: 0;
}

.dt-header__action-btn svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: var(--dt-color-icon-dark);
}

.dt-header__action-btn:hover,
.dt-header__action-btn:focus-visible {
  background: var(--dt-color-background-secondary);
  outline: none;
}

.dt-header__profile-wrapper {
  position: relative;
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
  font-size: var(--dt-text-body-sm);
  font-weight: 600;
  background: var(--dt-color-background-secondary);
  color: var(--dt-color-text);
  letter-spacing: 0.02em;
}

@media (max-width: 1024px) {
  .dt-header {
    height: var(--dt-header-height-mobile);
    padding: 0 var(--dt-spacing-xl);
  }

  .dt-header__mobile-trigger {
    display: inline-flex;
  }

  .dt-header__action-btn {
    width: 36px;
    height: 36px;
  }

  .dt-header__action-btn svg {
    width: 20px;
    height: 20px;
  }

  .dt-header__avatar {
    width: 32px;
    height: 32px;
  }
}
</style>
