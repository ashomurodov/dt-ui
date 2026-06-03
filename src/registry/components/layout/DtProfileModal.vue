<script lang="ts" setup>
import { computed, ref, watch, onMounted, onUnmounted, useSlots } from 'vue'

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
type View = 'main' | 'appearance' | 'language' | 'switch-account'

// Built-in i18n — shared across all 23 modules
const i18n: Record<Locale, Record<string, string>> = {
  ru: {
    profile: 'Профиль',
    appearance: 'Внешний вид',
    language: 'Язык',
    logout: 'Выйти',
    switchAccount: 'Сменить аккаунт',
    lightTheme: 'Светлая тема',
    darkTheme: 'Тёмная тема',
    systemTheme: 'Системная',
  },
  uz: {
    profile: 'Profil',
    appearance: 'Tashqi ko\'rinish',
    language: 'Til',
    logout: 'Chiqish',
    switchAccount: 'Hisobni almashtirish',
    lightTheme: 'Yorug\' mavzu',
    darkTheme: 'Qorong\'u mavzu',
    systemTheme: 'Tizim',
  },
  en: {
    profile: 'Profile',
    appearance: 'Appearance',
    language: 'Language',
    logout: 'Logout',
    switchAccount: 'Switch account',
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
  // Fired when the user opens the Switch-account sub-view (so the host can lazy-load accounts).
  'open-switch-account': []
}>()

const slots = useSlots()
// The Switch-account menu item + sub-view appear only when the host provides the slot.
const hasSwitchAccount = computed(() => !!slots['switch-account'])

// Internal translations
const t = (key: string) => i18n[props.locale]?.[key] ?? i18n.en[key] ?? key

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const currentView = ref<View>('main')
// Drives the slide direction: forward = deeper (slide in from right), back = to main (from left).
const direction = ref<'forward' | 'back'>('forward')
const modalRef = ref<HTMLElement | null>(null)

const slideClass = computed(() =>
  direction.value === 'back'
    ? 'dt-profile-modal__content--from-left'
    : 'dt-profile-modal__content--from-right'
)

const goTo = (view: View) => {
  direction.value = 'forward'
  currentView.value = view
  if (view === 'switch-account') emit('open-switch-account')
}

const goBack = () => {
  direction.value = 'back'
  currentView.value = 'main'
}

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
  const logo = props.user.logo_url
  if (!logo) return null
  // Absolute URLs (resource service) are used as-is; bare keys get the resource base.
  if (/^https?:\/\//i.test(logo)) return logo
  if (props.resourceUrl) return `${props.resourceUrl}/${logo}`
  return logo
})

// Initials match the displayed name: organization context → org initials, personal → user's.
const profileInitials = computed(() => {
  const parts = (displayName.value || '').trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
})

const close = () => {
  isOpen.value = false
}

watch(isOpen, (opened) => {
  if (!opened) {
    setTimeout(() => {
      currentView.value = 'main'
      direction.value = 'forward'
    }, 300)
  }
})

const onClickOutside = (e: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(e.target as Node)) {
    const profileBtn = modalRef.value.closest('.dt-header__profile-wrapper')
      ?.querySelector('.dt-header__profile-trigger')
    const legacyProfileBtn = modalRef.value.closest('.dt-header__actions')
      ?.querySelector('.dt-header__circle-btn:last-of-type')
    if (profileBtn && profileBtn.contains(e.target as Node)) return
    if (legacyProfileBtn && legacyProfileBtn.contains(e.target as Node)) return
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

const openProfile = () => {
  if (props.profileUrl) window.open(props.profileUrl, '_blank')
  close()
}

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
      <!-- Single panel, re-keyed per view. The incoming panel slides in (direction-aware);
           the outgoing one is removed instantly — no leave animation, so it stays snappy. -->
      <div :key="currentView" class="dt-profile-modal__content" :class="slideClass">
        <!-- Main view -->
        <template v-if="currentView === 'main'">
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
            <!-- Account actions -->
            <ul class="dt-profile-modal__list">
              <li v-if="hasSwitchAccount" class="dt-profile-modal__item" @click="goTo('switch-account')">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 19.5C3 16.7386 4.79086 15 7 15C8.06087 15 9.0783 15.3214 9.82843 15.8787" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M17 19.5C18.3807 19.5 19.5 18.3807 19.5 17C19.5 15.6193 18.3807 14.5 17 14.5C15.6193 14.5 14.5 15.6193 14.5 17C14.5 18.3807 15.6193 19.5 17 19.5Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M14 6.5H18.5C19.6046 6.5 20.5 7.39543 20.5 8.5V10M20.5 10L19 8.5M20.5 10L22 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ t('switchAccount') }}</span>
              </li>
              <li v-if="profileUrl" class="dt-profile-modal__item" @click="openProfile">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4.5 18.5C4.5 15 7.36 13 11 13C14.64 13 17.5 15 17.5 18.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('profile') }}</span>
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
              <li class="dt-profile-modal__item" @click="goTo('appearance')">
                <svg class="dt-profile-modal__icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M11 2V4M11 18V20M2 11H4M18 11H20M4.93 4.93L6.34 6.34M15.66 15.66L17.07 17.07M4.93 17.07L6.34 15.66M15.66 6.34L17.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('appearance') }}</span>
              </li>
              <li class="dt-profile-modal__item" @click="goTo('language')">
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
        </template>

        <!-- Appearance view -->
        <template v-else-if="currentView === 'appearance'">
          <div class="dt-profile-modal__sub-header">
            <button class="dt-profile-modal__back" @click="goBack">
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
        </template>

        <!-- Language view -->
        <template v-else-if="currentView === 'language'">
          <div class="dt-profile-modal__sub-header">
            <button class="dt-profile-modal__back" @click="goBack">
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
        </template>

        <!-- Switch-account view — host fills the #switch-account slot with the account list. -->
        <template v-else-if="currentView === 'switch-account'">
          <div class="dt-profile-modal__sub-header">
            <button class="dt-profile-modal__back" @click="goBack">
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
            <h2 class="dt-profile-modal__options-title">{{ t('switchAccount') }}</h2>
            <slot name="switch-account" :close="close" :back="goBack" />
          </div>
        </template>
      </div>
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
  padding: var(--dt-spacing-xl);
}

/* Direction-aware slide for the incoming view (matches the native dt-header).
   Only the entering panel animates — the outgoing one is removed instantly,
   which keeps view changes snappy (no leave-then-enter lag). */
.dt-profile-modal__content--from-right {
  animation: dt-profile-from-right 0.28s ease;
}

.dt-profile-modal__content--from-left {
  animation: dt-profile-from-left 0.28s ease;
}

@keyframes dt-profile-from-right {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes dt-profile-from-left {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

.dt-profile-modal__top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-spacing-md);
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
  border-radius: var(--dt-radius-xs);
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
  padding-bottom: var(--dt-spacing-lg);
}

.dt-profile-modal__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: var(--dt-spacing-lg);
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
  font-size: var(--dt-text-h4);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.dt-profile-modal__name {
  font-size: var(--dt-text-h5);
  font-weight: 600;
  color: var(--dt-color-text);
  margin: 0 0 var(--dt-spacing-xs) 0;
  text-align: center;
}

.dt-profile-modal__details {
  font-size: var(--dt-text-body-sm);
  color: var(--dt-color-text-secondary);
  margin: 0;
}

/* Menu */
.dt-profile-modal__menu {
  padding-top: var(--dt-spacing-xs);
}

.dt-profile-modal__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dt-profile-modal__item {
  display: flex;
  align-items: center;
  gap: var(--dt-spacing-lg);
  padding: 10px var(--dt-spacing-lg);
  border-radius: var(--dt-radius-sm);
  color: var(--dt-color-text);
  cursor: pointer;
  transition: background var(--dt-transition-fast);
  font-size: var(--dt-text-body-sm);
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
  margin: var(--dt-spacing-md) 0;
}

/* Options (theme / language) + switch-account sub-section share this header. */
.dt-profile-modal__options-section {
  padding-top: var(--dt-spacing-xl);
}

.dt-profile-modal__options-title {
  font-size: var(--dt-text-h4);
  font-weight: 600;
  color: var(--dt-color-text);
  margin: 0 0 var(--dt-spacing-xl) 0;
  line-height: 1.25;
}

.dt-profile-modal__options {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-xs);
}

.dt-profile-modal__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-spacing-lg);
  border-radius: var(--dt-radius-sm);
  cursor: pointer;
  transition: background var(--dt-transition-fast);
  font-size: var(--dt-text-body-sm);
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

/* Open/close fade for the whole modal */
.dt-profile-fade-enter-active,
.dt-profile-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dt-profile-fade-enter-from,
.dt-profile-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
