<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarStatus = 'online' | 'offline'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  name?: string
  initials?: string
  size?: AvatarSize
  bordered?: boolean
  status?: AvatarStatus | null
}>(), {
  size: 'md',
  bordered: false,
  status: null,
})

const slots = useSlots()

const imageFailed = ref(false)
watch(() => props.src, () => { imageFailed.value = false })

const computedInitials = computed(() => {
  if (props.initials) return props.initials.slice(0, 2).toUpperCase()
  if (!props.name) return ''
  const parts = props.name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
})

const mode = computed<'image' | 'initials' | 'icon'>(() => {
  if (props.src && !imageFailed.value) return 'image'
  if (computedInitials.value) return 'initials'
  return 'icon'
})

const accessibleAlt = computed(() => props.alt ?? props.name ?? '')

const showStatus = computed(() => !!slots.status || props.status != null)
</script>

<template>
  <span class="dt-avatar" :class="[`dt-avatar--${size}`, { 'dt-avatar--bordered': bordered }]">
    <span class="dt-avatar__body">
      <img
        v-if="mode === 'image'"
        class="dt-avatar__img"
        :src="src"
        :alt="accessibleAlt"
        @error="imageFailed = true"
      />
      <span v-else-if="mode === 'initials'" class="dt-avatar__initials" aria-hidden="true">
        {{ computedInitials }}
      </span>
      <svg
        v-else
        class="dt-avatar__icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12.75a4.875 4.875 0 1 0 0-9.75 4.875 4.875 0 0 0 0 9.75ZM12 14.25c-4.5 0-8.25 2.25-8.25 6 0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75c0-3.75-3.75-6-8.25-6Z" />
      </svg>
      <span v-if="mode === 'initials' && accessibleAlt" class="dt-avatar__sr">{{ accessibleAlt }}</span>
    </span>

    <span v-if="showStatus" class="dt-avatar__status" :class="status && `dt-avatar__status--${status}`">
      <slot name="status" />
    </span>
  </span>
</template>

<style scoped>
.dt-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-radius-full);
  flex-shrink: 0;
  position: relative;
}

.dt-avatar__body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--dt-radius-full);
  background: var(--dt-color-background-tertiary);
  border: 1px solid var(--dt-color-border);
  overflow: hidden;
  color: var(--dt-color-text-tertiary);
}

.dt-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dt-avatar__initials {
  font-family: var(--dt-font-family);
  font-weight: var(--dt-font-bold);
  color: var(--dt-color-text-tertiary);
  line-height: 1;
  user-select: none;
}

.dt-avatar__icon {
  width: 60%;
  height: 60%;
}

.dt-avatar__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Sizes ──────────────────────────────────── */
.dt-avatar--xs  { width: 24px; height: 24px; }
.dt-avatar--sm  { width: 32px; height: 32px; }
.dt-avatar--md  { width: 40px; height: 40px; }
.dt-avatar--lg  { width: 48px; height: 48px; }
.dt-avatar--xl  { width: 56px; height: 56px; }
.dt-avatar--2xl { width: 64px; height: 64px; }

.dt-avatar--xs  .dt-avatar__initials { font-size: 12px; }
.dt-avatar--sm  .dt-avatar__initials { font-size: 14px; }
.dt-avatar--md  .dt-avatar__initials { font-size: 16px; }
.dt-avatar--lg  .dt-avatar__initials { font-size: 20px; }
.dt-avatar--xl  .dt-avatar__initials { font-size: 24px; }
.dt-avatar--2xl .dt-avatar__initials { font-size: 32px; }

/* ── Bordered (outer ring with 2px gap) ─────── */
.dt-avatar--bordered {
  box-shadow: inset 0 0 0 1px var(--dt-color-border);
}
.dt-avatar--bordered .dt-avatar__body {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
}

/* ── Status indicator ────────────────────────
   Wrapper sits at the bottom-right corner, slightly past the avatar boundary.
   A box-shadow draws the white halo against the avatar.
   The default "online"/"offline" presets render a colored dot filling the wrapper.
   When the #status slot is provided, the consumer owns the visual.
*/
.dt-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-radius-full);
  box-shadow: 0 0 0 1.5px var(--dt-color-background);
  overflow: hidden;
}

.dt-avatar--xs  .dt-avatar__status { width: 8px;  height: 8px;  transform: translate(15%, 15%); }
.dt-avatar--sm  .dt-avatar__status { width: 10px; height: 10px; transform: translate(15%, 15%); }
.dt-avatar--md  .dt-avatar__status { width: 12px; height: 12px; transform: translate(15%, 15%); }
.dt-avatar--lg  .dt-avatar__status { width: 14px; height: 14px; transform: translate(15%, 15%); }
.dt-avatar--xl  .dt-avatar__status { width: 16px; height: 16px; transform: translate(15%, 15%); }
.dt-avatar--2xl .dt-avatar__status { width: 18px; height: 18px; transform: translate(15%, 15%); }

.dt-avatar__status--online  { background: var(--dt-color-success); }
.dt-avatar__status--offline { background: var(--dt-gray-300); }

/* When the slot supplies content, drop the colored background so it doesn't bleed through */
.dt-avatar__status:has(> *:not(:empty)) {
  background: transparent;
}

/* Slot content fills the wrapper */
.dt-avatar__status > :deep(*) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
