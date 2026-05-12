import fs from 'node:fs'
import path from 'node:path'
import { getDocContent, loadRegistry } from './registry.js'
import type { DtUiConfig } from './config.js'

const AGENT_HEADER = `# DT UI — Component Reference

This project uses dt-ui components. Below is the complete API reference for all installed components. Components use pure CSS with CSS custom properties for theming. No Tailwind or CSS framework required.

## Theming

All components use CSS custom properties prefixed with \`--dt-\` defined in \`base.css\`. Override them in your project's CSS to customize the look.

### Key Tokens

| Token | Default (Light) | Description |
|-------|-----------------|-------------|
| \`--dt-color-accent\` | \`#0096b2\` | Brand/primary color |
| \`--dt-color-accent-hover\` | \`#007a91\` | Primary hover state |
| \`--dt-color-accent-foreground\` | \`#ffffff\` | Text on primary bg |
| \`--dt-color-text\` | \`#131720\` | Main text color |
| \`--dt-color-text-secondary\` | \`#667085\` | Secondary text |
| \`--dt-color-background\` | \`#ffffff\` | Page background |
| \`--dt-color-background-tertiary\` | \`#f0f2f5\` | Tertiary surface |
| \`--dt-color-border\` | \`#dde1e9\` | Border color |
| \`--dt-color-error\` | \`#ef4444\` | Error/destructive color |
| \`--dt-color-success\` | \`#16a34a\` | Success color |
| \`--dt-color-warning\` | \`#eab308\` | Warning color (yellow) |
| \`--dt-color-ring\` | \`#0096b2\` | Focus ring color |
| \`--dt-radius-xs\` | \`6px\` | Small radius (badges) |
| \`--dt-radius-md\` | \`12px\` | Base radius (inputs, buttons) |
| \`--dt-radius-lg\` | \`16px\` | Large radius (cards, rows) |
| \`--dt-font-family\` | \`'Lab Grotesque', system-ui\` | Font family |

### Dark Mode

Set \`data-theme="dark"\` on \`<html>\`. All tokens automatically adjust.

---

## Components

`

export function getAgentMdPath(): string {
  return path.resolve(process.cwd(), 'AGENT.md')
}

export function createAgentMd(): void {
  fs.writeFileSync(getAgentMdPath(), AGENT_HEADER, 'utf-8')
}

export function appendComponentDoc(componentName: string): void {
  const registry = loadRegistry()
  const component = registry.components[componentName]
  if (!component) return

  const docContent = getDocContent(component.docs)
  if (!docContent) return

  const agentPath = getAgentMdPath()
  if (!fs.existsSync(agentPath)) {
    createAgentMd()
  }

  const existing = fs.readFileSync(agentPath, 'utf-8')

  // Check if already documented
  if (existing.includes(`# ${component.name}`)) return

  const separator = '\n---\n\n'
  fs.appendFileSync(agentPath, docContent + separator, 'utf-8')
}

export function rebuildAgentMd(config: DtUiConfig): void {
  createAgentMd()
  for (const componentName of config.installedComponents) {
    appendComponentDoc(componentName)
  }
}
