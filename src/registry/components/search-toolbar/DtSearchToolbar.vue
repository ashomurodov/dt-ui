<script lang="ts" setup>
defineProps<{
  searchPlaceholder?: string
  addLabel?: string
}>()

const search = defineModel<string>('search', { default: '' })

defineEmits<{
  add: []
  search: []
}>()
</script>

<template>
  <div class="dt-search-toolbar">
    <div class="dt-search-toolbar__search">
      <input
        v-model="search"
        type="text"
        class="dt-search-toolbar__input"
        :placeholder="searchPlaceholder"
        @input="$emit('search')"
      />
      <svg class="dt-search-toolbar__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <button v-if="addLabel" class="dt-search-toolbar__add-btn" @click="$emit('add')">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ addLabel }}
    </button>
  </div>
</template>

<style scoped>
.dt-search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
  margin-bottom: 20px;
}

.dt-search-toolbar__search {
  position: relative;
  width: 250px;
}

.dt-search-toolbar__input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 var(--dt-space-4);
  border: 1px solid var(--dt-color-border);
  border-radius: var(--dt-radius-lg);
  background: var(--dt-color-background);
  font-size: var(--dt-text-sm);
  font-family: inherit;
  color: var(--dt-color-text);
  outline: none;
  transition: border-color var(--dt-transition-fast);
}

.dt-search-toolbar__input::placeholder {
  color: var(--dt-color-text-tertiary);
}

.dt-search-toolbar__input:focus {
  border-color: var(--dt-color-accent);
}

.dt-search-toolbar__icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--dt-color-text-tertiary);
  pointer-events: none;
}

.dt-search-toolbar__add-btn {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: var(--dt-radius-base);
  background: var(--dt-color-accent);
  color: #ffffff;
  font-size: var(--dt-text-sm);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--dt-transition-fast);
}

.dt-search-toolbar__add-btn:hover {
  background: var(--dt-color-accent-hover);
}

.dt-search-toolbar__add-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .dt-search-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .dt-search-toolbar__search {
    width: 100%;
  }

  .dt-search-toolbar__add-btn {
    justify-content: center;
  }
}
</style>
