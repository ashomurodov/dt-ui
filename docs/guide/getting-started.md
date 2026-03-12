# Getting Started

## Installation

Initialize dt-ui in your Vue project:

```bash
npx dt-ui init
```

The init wizard will:

1. Detect your framework (Nuxt, Vue + Vite, or plain Vue)
2. Ask where to place components and lib files
3. Copy `base.css` (design tokens) into your styles directory
4. Copy `lib/utils.ts` shared helper
5. Optionally create `AGENT.md` for AI coding assistants

## Import base.css

Add the design tokens to your main entry file:

::: code-group

```ts [main.ts (Vue)]
import './styles/base.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```ts [nuxt.config.ts (Nuxt)]
export default defineNuxtConfig({
  css: ['~/styles/base.css'],
})
```

:::

## Add Your First Component

```bash
npx dt-ui add button
```

This copies the Button component files into your configured components directory (e.g., `src/components/ui/button/`).

## Use It

```vue
<script setup lang="ts">
import { DtButton } from '@/components/ui/button'
</script>

<template>
  <DtButton variant="default">Click me</DtButton>
  <DtButton variant="outline">Outline</DtButton>
  <DtButton variant="destructive">Delete</DtButton>
</template>
```

## Add More Components

```bash
# Add multiple at once
npx dt-ui add card badge dialog

# See what's available
npx dt-ui list
```

Components with internal dependencies will prompt you to install them. For example, `dialog` depends on `button`.
