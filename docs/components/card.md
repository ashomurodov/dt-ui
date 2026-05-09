# Card

A container card with header, content, and footer sections.

```bash
npx dt-ui add card
```

## Usage

```vue
<script setup lang="ts">
import { DtCard, DtCardHeader, DtCardContent, DtCardFooter } from '@/components/ui/card'
</script>

<template>
  <DtCard>
    <DtCardHeader>
      <h3>Card Title</h3>
      <p>Card description text</p>
    </DtCardHeader>
    <DtCardContent>
      <p>Main card content goes here.</p>
    </DtCardContent>
    <DtCardFooter>
      <DtButton variant="outline">Cancel</DtButton>
      <DtButton>Save</DtButton>
    </DtCardFooter>
  </DtCard>
</template>
```

## With Shadow

```vue
<template>
  <DtCard :shadow="true" :bordered="false">
    <DtCardContent>
      Shadow card without border.
    </DtCardContent>
  </DtCard>
</template>
```

## DtCard Props

| Prop | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `boolean` | `false` | Show box shadow |
| `padding` | `boolean` | `true` | Add padding |

## Sub-components

| Component | Description |
| ----------- | ------------- |
| `DtCardHeader` | Card header with title/description styling |
| `DtCardContent` | Main content area |
| `DtCardFooter` | Footer with flex layout for actions |
