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
        text: 'Form',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
          { text: 'Select', link: '/components/select' },
          { text: 'Toggle', link: '/components/toggle' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Radio', link: '/components/radio' },
        ],
      },
      {
        text: 'Data Display',
        items: [
          { text: 'Badge', link: '/components/badge' },
          { text: 'Status Badge', link: '/components/status-badge' },
          { text: 'Card', link: '/components/card' },
          { text: 'Data Table', link: '/components/data-table' },
          { text: 'Pagination', link: '/components/pagination' },
        ],
      },
      {
        text: 'Navigation',
        items: [
          { text: 'Tab Switcher', link: '/components/tab-switcher' },
          { text: 'Search Toolbar', link: '/components/search-toolbar' },
          { text: 'Layout', link: '/components/layout' },
        ],
      },
      {
        text: 'Overlay',
        items: [
          { text: 'Dialog', link: '/components/dialog' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: '#' },
    ],
  },
})
