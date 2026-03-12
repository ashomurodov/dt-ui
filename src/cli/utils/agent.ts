import fs from 'node:fs'
import path from 'node:path'
import { getDocContent, loadRegistry } from './registry.js'
import type { DtUiConfig } from './config.js'

const AGENT_HEADER = `# DT UI — Component Reference

This project uses dt-ui components. Below is the complete API reference for all installed components. Components use pure CSS with CSS custom properties for theming. No Tailwind or CSS framework required.

## Theming

All components use CSS custom properties prefixed with \`--dt-\` defined in \`base.css\`. Override them in your project's CSS to customize the look.

### Available Tokens

| Token | Default (Light) | Description |
|-------|-----------------|-------------|
| \`--dt-primary\` | \`hsl(190 100% 35%)\` | Brand/primary color (RGB 0, 150, 178) |
| \`--dt-primary-hover\` | \`hsl(190 100% 28%)\` | Primary hover state |
| \`--dt-primary-foreground\` | \`hsl(0 0% 100%)\` | Text on primary bg |
| \`--dt-secondary\` | \`hsl(220 13% 46%)\` | Secondary color (RGB 102, 112, 133) |
| \`--dt-secondary-foreground\` | \`hsl(0 0% 100%)\` | Text on secondary bg |
| \`--dt-destructive\` | \`hsl(0 72% 51%)\` | Destructive/danger color |
| \`--dt-success\` | \`hsl(142 72% 40%)\` | Success color |
| \`--dt-warning\` | \`hsl(38 92% 50%)\` | Warning color |
| \`--dt-border\` | \`hsl(190 13% 88%)\` | Border color |
| \`--dt-ring\` | \`hsl(190 100% 35%)\` | Focus ring color |
| \`--dt-radius-sm\` | \`0.25rem\` | Small border radius |
| \`--dt-radius-md\` | \`0.375rem\` | Medium border radius |
| \`--dt-radius-lg\` | \`0.5rem\` | Large border radius |
| \`--dt-shadow-sm\` | \`0 1px 2px...\` | Small shadow |
| \`--dt-shadow-md\` | \`0 4px 6px...\` | Medium shadow |
| \`--dt-shadow-lg\` | \`0 10px 15px...\` | Large shadow |

### Dark Mode

Add the \`dark\` class to your \`<html>\` or \`<body>\` element. All tokens automatically adjust.

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
  if (existing.includes(`### ${component.name}`)) return

  const separator = '\n---\n\n'
  fs.appendFileSync(agentPath, docContent + separator, 'utf-8')
}

export function rebuildAgentMd(config: DtUiConfig): void {
  createAgentMd()
  for (const componentName of config.installedComponents) {
    appendComponentDoc(componentName)
  }
}
