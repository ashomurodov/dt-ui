<script lang="ts" setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

export interface DtUser {
  first_name: string
  last_name: string
  middle_name?: string
  logo_url?: string
  phone_numbers?: { number: string }[]
  organization_name?: string
}

export interface DtProfileMenuItem {
  key: string
  label: string
  icon?: any
  href?: string
}

type Theme = 'light' | 'dark' | 'system'
type Locale = 'uz' | 'ru' | 'en'

// Built-in i18n — shared across all 23 modules
const i18n: Record<Locale, Record<string, string>> = {
  ru: {
    appearance: 'Внешний вид',
    language: 'Язык',
    logout: 'Выйти',
    lightTheme: 'Светлая тема',
    darkTheme: 'Тёмная тема',
    systemTheme: 'Системная',
  },
  uz: {
    appearance: 'Tashqi ko\'rinish',
    language: 'Til',
    logout: 'Chiqish',
    lightTheme: 'Yorug\' mavzu',
    darkTheme: 'Qorong\'u mavzu',
    systemTheme: 'Tizim',
  },
  en: {
    appearance: 'Appearance',
    language: 'Language',
    logout: 'Logout',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    systemTheme: 'System',
  },
}

const LOCALES: { code: Locale; name: string }[] = [
  { code: 'uz', name: "O'zbekcha" },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
]

const THEME_OPTIONS: { value: Theme; labelKey: string }[] = [
  { value: 'light', labelKey: 'lightTheme' },
  { value: 'dark', labelKey: 'darkTheme' },
  { value: 'system', labelKey: 'systemTheme' },
]

const props = withDefaults(defineProps<{
  modelValue: boolean
  user: DtUser
  locale?: Locale
  theme?: Theme
  menuItems?: DtProfileMenuItem[]
  isOrganization?: boolean
  profileUrl?: string
  resourceUrl?: string
}>(), {
  locale: 'uz',
  theme: 'light',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'theme-change': [value: Theme]
  'locale-change': [code: Locale]
  'logout': []
  'menu-click': [key: string]
}>()

// Internal translations
const t = (key: string) => i18n[props.locale]?.[key] ?? i18n.en[key] ?? key

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const currentView = ref<'main' | 'appearance' | 'language'>('main')
const modalRef = ref<HTMLElement | null>(null)

const displayName = computed(() => {
  if (props.isOrganization && props.user.organization_name) {
    return props.user.organization_name
  }
  return [props.user.first_name, props.user.last_name].filter(Boolean).join(' ')
})

const displayDetails = computed(() => {
  return props.user.phone_numbers?.[0]?.number || ''
})

const avatarUrl = computed(() => {
  if (!props.user.logo_url) return null
  if (props.resourceUrl) return `${props.resourceUrl}/${props.user.logo_url}`
  return props.user.logo_url
})

const profileInitials = computed(() => {
  const first = props.user.first_name?.[0] || ''
  const last = props.user.last_name?.[0] || ''
  return (first + last).toUpperCase()
})

const close = () => {
  isOpen.value = false
}

watch(isOpen, (opened) => {
  if (!opened) {
    setTimeout(() => { currentView.value = 'main' }, 300)
  }
})

const onClickOutside = (e: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(e.target as Node)) {
    const profileBtn = modalRef.value.closest('.dt-header__actions')
      ?.querySelector('.dt-header__circle-btn:last-of-type')
    if (profileBtn && profileBtn.contains(e.target as Node)) return
    close()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

const onMenuItemClick = (item: DtProfileMenuItem) => {
  if (item.href) {
    window.open(item.href, '_blank')
    close()
    return
  }
  emit('menu-click', item.key)
}
</script>

<template>
  <Transition name="dt-profile-fade">
    <div v-if="isOpen" ref="modalRef" class="dt-profile-modal">
      <Transition name="dt-profile-slide" mode="out-in">
        <!-- Main view -->
        <div v-if="currentView === 'main'" key="main" class="dt-profile-modal__content">
          <div class="dt-profile-modal__top-row">
            <span />
            <button class="dt-profile-modal__close" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="dt-profile-modal__user">
            <div class="dt-profile-modal__avatar" :class="{ 'dt-profile-modal__avatar--initials': !avatarUrl }">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
              <span v-else>{{ profileInitials }}</span>
            </div>
            <h3 class="dt-profile-modal__name">{{ displayName }}</h3>
            <p v-if="displayDetails" class="dt-profile-modal__details">{{ displayDetails }}</p>
          </div>

          <div class="dt-profile-modal__menu">
            <!-- Profile link -->
            <ul class="dt-profile-modal__list">
              <li v-if="profileUrl" class="dt-profile-modal__item" @click="window.open(profileUrl, '_blank'); close()">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4.5 18.5C4.5 15 7.36 13 11 13C14.64 13 17.5 15 17.5 18.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('profile') || (locale === 'ru' ? 'Профиль' : locale === 'uz' ? 'Profil' : 'Profile') }}</span>
              </li>
            </ul>

            <!-- Custom menu items -->
            <template v-if="menuItems?.length">
              <div class="dt-profile-modal__divider" />
              <ul class="dt-profile-modal__list">
                <li
                  v-for="item in menuItems"
                  :key="item.key"
                  class="dt-profile-modal__item"
                  @click="onMenuItemClick(item)"
                >
                  <component v-if="item.icon" :is="item.icon" class="dt-profile-modal__icon" />
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </template>

            <div class="dt-profile-modal__divider" />

            <!-- Appearance + Language -->
            <ul class="dt-profile-modal__list">
              <li class="dt-profile-modal__item" @click="currentView = 'appearance'">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M11 2V4M11 18V20M2 11H4M18 11H20M4.93 4.93L6.34 6.34M15.66 15.66L17.07 17.07M4.93 17.07L6.34 15.66M15.66 6.34L17.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('appearance') }}</span>
              </li>
              <li class="dt-profile-modal__item" @click="currentView = 'language'">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 11H20M11 2C13.5 4.5 15 7.5 15 11C15 14.5 13.5 17.5 11 20M11 2C8.5 4.5 7 7.5 7 11C7 14.5 8.5 17.5 11 20" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>{{ t('language') }}</span>
              </li>
              <slot name="menu-extra" />
            </ul>

            <div class="dt-profile-modal__divider" />

            <!-- Logout -->
            <ul class="dt-profile-modal__list">
              <li class="dt-profile-modal__item" @click="emit('logout'); close()">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M8 19H5C3.895 19 3 18.105 3 17V5C3 3.895 3.895 3 5 3H8M15 16L19 12M19 12L15 8M19 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ t('logout') }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Appearance view -->
        <div v-else-if="currentView === 'appearance'" key="appearance" class="dt-profile-modal__content">
          <div class="dt-profile-modal__sub-header">
            <button class="dt-profile-modal__back" @click="currentView = 'main'">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="dt-profile-modal__close" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="dt-profile-modal__options-section">
            <h2 class="dt-profile-modal__options-title">{{ t('appearance') }}</h2>
            <div class="dt-profile-modal__options">
              <button
                v-for="option in THEME_OPTIONS"
                :key="option.value"
                class="dt-profile-modal__option"
                :class="{ 'dt-profile-modal__option--active': theme === option.value }"
                @click="emit('theme-change', option.value)"
              >
                <span class="dt-profile-modal__option-label">{{ t(option.labelKey) }}</span>
                <span class="dt-profile-modal__radio">
                  <span v-if="theme === option.value" class="dt-profile-modal__radio-dot" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Language view -->
        <div v-else-if="currentView === 'language'" key="language" class="dt-profile-modal__content">
          <div class="dt-profile-modal__sub-header">
            <button class="dt-profile-modal__back" @click="currentView = 'main'">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="dt-profile-modal__close" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="dt-profile-modal__options-section">
            <h2 class="dt-profile-modal__options-title">{{ t('language') }}</h2>
            <div class="dt-profile-modal__options">
              <button
                v-for="lang in LOCALES"
                :key="lang.code"
                class="dt-profile-modal__option"
                :class="{ 'dt-profile-modal__option--active': locale === lang.code }"
                @click="emit('locale-change', lang.code)"
              >
                <span class="dt-profile-modal__option-label">{{ lang.name }}</span>
                <span class="dt-profile-modal__radio">
                  <span v-if="locale === lang.code" class="dt-profile-modal__radio-dot" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.dt-profile-modal {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: var(--dt-color-surface);
  border-radius: var(--dt-radius-lg);
  box-shadow: var(--dt-shadow-lg);
  border: 1px solid var(--dt-color-border);
  overflow: hidden;
  z-index: 1000;
}

.dt-profile-modal__content {
  position: relative;
  padding: var(--dt-space-4);
}

.dt-profile-modal__top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-2);
}

.dt-profile-modal__sub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dt-profile-modal__close,
.dt-profile-modal__back {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--dt-radius-sm);
  color: var(--dt-color-icon-secondary);
  cursor: pointer;
  padding: 2px;
  transition: all var(--dt-transition-fast);
}

.dt-profile-modal__close:hover,
.dt-profile-modal__back:hover {
  background: var(--dt-color-surface-hover);
  color: var(--dt-color-text);
}

/* User section */
.dt-profile-modal__user {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: var(--dt-space-3);
}

.dt-profile-modal__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: var(--dt-space-3);
}

.dt-profile-modal__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dt-profile-modal__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-background-secondary);
  color: var(--dt-color-text);
  font-size: var(--dt-text-xl);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.dt-profile-modal__name {
  font-size: var(--dt-text-lg);
  font-weight: 600;
  color: var(--dt-color-text);
  margin: 0 0 var(--dt-space-1) 0;
  text-align: center;
}

.dt-profile-modal__details {
  font-size: var(--dt-text-sm);
  color: var(--dt-color-text-secondary);
  margin: 0;
}

/* Menu */
.dt-profile-modal__menu {
  padding-top: var(--dt-space-1);
}

.dt-profile-modal__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dt-profile-modal__item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  padding: 10px var(--dt-space-3);
  border-radius: var(--dt-radius-md);
  color: var(--dt-color-text);
  cursor: pointer;
  transition: background var(--dt-transition-fast);
  font-size: var(--dt-text-sm);
  text-decoration: none;
}

.dt-profile-modal__item:hover {
  background: var(--dt-color-surface-hover);
}

.dt-profile-modal__icon {
  width: 22px;
  height: 22px;
  color: var(--dt-color-icon-dark);
  flex-shrink: 0;
}

.dt-profile-modal__divider {
  height: 1px;
  background: var(--dt-color-divider);
  margin: var(--dt-space-2) 0;
}

/* Options (theme / language) */
.dt-profile-modal__options-section {
  padding-top: var(--dt-space-4);
}

.dt-profile-modal__options-title {
  font-size: var(--dt-text-xl);
  font-weight: 600;
  color: var(--dt-color-text);
  margin: 0 0 var(--dt-space-4) 0;
  line-height: 1.25;
}

.dt-profile-modal__options {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-1);
}

.dt-profile-modal__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-3);
  border-radius: var(--dt-radius-md);
  cursor: pointer;
  transition: background var(--dt-transition-fast);
  font-size: var(--dt-text-sm);
  color: var(--dt-color-text);
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-family: inherit;
}

.dt-profile-modal__option:hover {
  background: var(--dt-color-surface-hover);
}

.dt-profile-modal__option--active {
  background: var(--dt-color-surface-hover);
}

.dt-profile-modal__option-label {
  font-weight: 500;
}

.dt-profile-modal__radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--dt-color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--dt-transition-fast);
  flex-shrink: 0;
}

.dt-profile-modal__option--active .dt-profile-modal__radio {
  border-color: var(--dt-color-accent);
}

.dt-profile-modal__radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dt-color-accent);
  animation: dt-radio-pop 0.2s ease;
}

@keyframes dt-radio-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Transitions */
.dt-profile-fade-enter-active,
.dt-profile-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dt-profile-fade-enter-from,
.dt-profile-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.dt-profile-slide-enter-active,
.dt-profile-slide-leave-active {
  transition: all 0.25s ease;
}

.dt-profile-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.dt-profile-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
