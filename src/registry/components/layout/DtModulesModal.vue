<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'

export interface DtModuleClickPayload {
  item: DtModuleItem
  event: MouseEvent
}

export interface DtModuleItem {
  key: string
  label: string
  href?: string
  logo?: string
  icon?: any
  badge?: string | number
  description?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  active?: boolean
  disabled?: boolean
  hidden?: boolean
  span?: 'default' | 'full'
  onClick?: (payload: DtModuleClickPayload) => void | Promise<void>
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  modules?: DtModuleItem[]
  activeModule?: string
  title?: string
  description?: string
  closeLabel?: string
}>(), {
  modules: () => [],
  title: 'Modules',
  description: '',
  closeLabel: 'Close modules',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'module-click': [payload: DtModuleClickPayload]
}>()

const titleId = 'dt-modules-modal-title'

const visibleModules = computed(() => props.modules.filter((item) => !item.hidden))

const isActive = (item: DtModuleItem) => {
  return Boolean(item.active || (props.activeModule && item.key === props.activeModule))
}

const getRel = (item: DtModuleItem) => {
  if (item.rel) return item.rel
  return item.target === '_blank' ? 'noreferrer' : undefined
}

const close = () => {
  emit('update:modelValue', false)
}

const handleModuleClick = (event: MouseEvent, item: DtModuleItem) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  const payload: DtModuleClickPayload = { item, event }
  emit('module-click', payload)
  if (item.onClick) {
    void item.onClick(payload)
  }

  if (event.defaultPrevented) return
  close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dt-modules-fade">
      <div
        v-if="modelValue"
        class="dt-modules-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @click.self="close"
      >
        <div class="dt-modules-modal__overlay" />

        <div class="dt-modules-modal__panel">
          <button
            class="dt-modules-modal__close"
            type="button"
            :aria-label="closeLabel"
            @click="close"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div v-if="title || description" class="dt-modules-modal__header">
            <h2 v-if="title" :id="titleId" class="dt-modules-modal__title">{{ title }}</h2>
            <p v-if="description" class="dt-modules-modal__description">{{ description }}</p>
          </div>

          <div class="dt-modules-modal__grid">
            <template v-for="item in visibleModules" :key="item.key">
              <a
                v-if="item.href && !item.disabled"
                class="dt-modules-modal__item"
                :class="{
                  'dt-modules-modal__item--active': isActive(item),
                  'dt-modules-modal__item--full': item.span === 'full',
                }"
                :href="item.href"
                :target="item.target"
                :rel="getRel(item)"
                @click="handleModuleClick($event, item)"
              >
                <span class="dt-modules-modal__media">
                  <img v-if="item.logo" :src="item.logo" :alt="item.label" loading="lazy" />
                  <component v-else-if="item.icon" :is="item.icon" class="dt-modules-modal__icon" />
                  <span v-else class="dt-modules-modal__fallback">{{ item.label.slice(0, 1) }}</span>
                </span>
                <span class="dt-modules-modal__label">{{ item.label }}</span>
                <span v-if="item.badge" class="dt-modules-modal__badge">{{ item.badge }}</span>
                <span v-if="item.description" class="dt-modules-modal__item-description">
                  {{ item.description }}
                </span>
              </a>

              <button
                v-else
                class="dt-modules-modal__item"
                :class="{
                  'dt-modules-modal__item--active': isActive(item),
                  'dt-modules-modal__item--full': item.span === 'full',
                }"
                type="button"
                :disabled="item.disabled"
                @click="handleModuleClick($event, item)"
              >
                <span class="dt-modules-modal__media">
                  <img v-if="item.logo" :src="item.logo" :alt="item.label" loading="lazy" />
                  <component v-else-if="item.icon" :is="item.icon" class="dt-modules-modal__icon" />
                  <span v-else class="dt-modules-modal__fallback">{{ item.label.slice(0, 1) }}</span>
                </span>
                <span class="dt-modules-modal__label">{{ item.label }}</span>
                <span v-if="item.badge" class="dt-modules-modal__badge">{{ item.badge }}</span>
                <span v-if="item.description" class="dt-modules-modal__item-description">
                  {{ item.description }}
                </span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dt-modules-modal {
  position: fixed;
  inset: 0;
  z-index: calc(var(--dt-z-modal) + 20);
  display: grid;
  place-items: center;
  padding: var(--dt-spacing-2xl);
}

.dt-modules-modal__overlay {
  position: absolute;
  inset: 0;
  background: var(--dt-color-overlay);
  backdrop-filter: saturate(180%) blur(5px);
}

.dt-modules-modal__panel {
  position: relative;
  z-index: 1;
  width: min(100%, 360px);
  padding: var(--dt-spacing-xl);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-md);
  background: var(--dt-color-surface);
  box-shadow: var(--dt-shadow-lg);
}

.dt-modules-modal__close {
  position: absolute;
  top: calc(var(--dt-spacing-md) * -1);
  right: calc(var(--dt-spacing-md) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-full);
  background: var(--dt-color-surface);
  color: var(--dt-color-icon-dark);
  cursor: pointer;
  transition: background var(--dt-transition-fast), color var(--dt-transition-fast), border-color var(--dt-transition-fast);
}

.dt-modules-modal__close:hover,
.dt-modules-modal__close:focus-visible {
  border-color: var(--dt-color-border-hover);
  background: var(--dt-color-surface-hover);
  color: var(--dt-color-text);
  outline: none;
}

.dt-modules-modal__close svg {
  width: 18px;
  height: 18px;
}

.dt-modules-modal__header {
  margin-bottom: var(--dt-spacing-lg);
  padding-right: var(--dt-spacing-xl);
}

.dt-modules-modal__title {
  margin: 0;
  color: var(--dt-color-text);
  font-size: var(--dt-text-h5);
  font-weight: var(--dt-font-bold);
  line-height: var(--dt-leading-h5);
}

.dt-modules-modal__description {
  margin: var(--dt-spacing-xs) 0 0;
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-md);
}

.dt-modules-modal__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--dt-spacing-md);
}

.dt-modules-modal__item {
  position: relative;
  min-width: 0;
  min-height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dt-spacing-sm);
  padding: var(--dt-spacing-md);
  border: 1px solid transparent;
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-color-text);
  font: inherit;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--dt-transition-fast), border-color var(--dt-transition-fast), box-shadow var(--dt-transition-fast);
}

.dt-modules-modal__item:hover,
.dt-modules-modal__item:focus-visible {
  border-color: var(--dt-color-border);
  background: var(--dt-color-surface-hover);
  outline: none;
}

.dt-modules-modal__item--active {
  border-color: var(--dt-color-accent);
  box-shadow: 0 0 0 1px var(--dt-color-accent);
}

.dt-modules-modal__item:disabled {
  cursor: not-allowed;
  color: var(--dt-color-disabled-text);
  opacity: 0.65;
}

.dt-modules-modal__item--full {
  grid-column: 1 / -1;
  min-height: 64px;
  flex-direction: row;
  justify-content: center;
  gap: var(--dt-spacing-md);
  padding: var(--dt-spacing-lg);
  border-color: var(--dt-color-border);
}

.dt-modules-modal__media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.dt-modules-modal__media img,
.dt-modules-modal__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  color: var(--dt-color-icon);
}

.dt-modules-modal__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--dt-radius-sm);
  background: var(--dt-color-accent-light);
  color: var(--dt-color-accent);
  font-size: var(--dt-text-h5);
  font-weight: var(--dt-font-bold);
  text-transform: uppercase;
}

.dt-modules-modal__label {
  max-width: 100%;
  color: inherit;
  font-size: var(--dt-text-body-xs);
  font-weight: var(--dt-font-medium);
  line-height: var(--dt-leading-body-xs);
  overflow-wrap: anywhere;
}

.dt-modules-modal__item--full .dt-modules-modal__label {
  font-size: var(--dt-text-body-sm);
  line-height: var(--dt-leading-body-sm);
  font-weight: var(--dt-font-bold);
}

.dt-modules-modal__badge {
  position: absolute;
  top: var(--dt-spacing-xs);
  right: var(--dt-spacing-xs);
  min-width: 18px;
  height: 18px;
  padding: 0 var(--dt-spacing-sm);
  border-radius: var(--dt-radius-full);
  background: var(--dt-color-accent-light);
  color: var(--dt-color-accent);
  font-size: var(--dt-text-body-xs);
  font-weight: var(--dt-font-bold);
  line-height: var(--dt-leading-body-sm);
}

.dt-modules-modal__item-description {
  max-width: 100%;
  color: var(--dt-color-text-secondary);
  font-size: var(--dt-text-body-xs);
  line-height: var(--dt-leading-body-xs);
  overflow-wrap: anywhere;
}

.dt-modules-fade-enter-active,
.dt-modules-fade-leave-active {
  transition: opacity var(--dt-transition-base);
}

.dt-modules-fade-enter-from,
.dt-modules-fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .dt-modules-modal {
    padding: var(--dt-spacing-lg);
  }

  .dt-modules-modal__panel {
    width: min(100%, 320px);
    padding: var(--dt-spacing-lg);
  }

  .dt-modules-modal__grid {
    gap: var(--dt-spacing-sm);
  }

  .dt-modules-modal__item {
    min-height: 84px;
    padding: var(--dt-spacing-sm);
  }

  .dt-modules-modal__media {
    width: 36px;
    height: 36px;
  }
}
</style>
