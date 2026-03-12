import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DT UI',
  description: 'Lightweight, customizable Vue components for DT projects',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/button' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
          { text: 'CLI', link: '/guide/cli' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
          { text: 'Card', link: '/components/card' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Select', link: '/components/select' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: '#' },
    ],
  },
})
