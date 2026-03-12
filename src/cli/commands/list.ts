import * as p from '@clack/prompts'
import pc from 'picocolors'
import { configExists, readConfig } from '../utils/config.js'
import { loadRegistry } from '../utils/registry.js'

export async function listCommand() {
  p.intro(pc.bold(pc.cyan('dt-ui components')))

  const registry = loadRegistry()
  const installed = configExists() ? readConfig().installedComponents : []

  const components = Object.entries(registry.components)

  const rows = components.map(([key, comp]) => {
    const isInstalled = installed.includes(key)
    const status = isInstalled ? pc.green('✓') : pc.dim('○')
    const name = isInstalled ? pc.green(comp.name) : comp.name
    const deps = comp.internalDeps.length > 0
      ? pc.dim(` (requires: ${comp.internalDeps.join(', ')})`)
      : ''

    return `  ${status}  ${name.padEnd(isInstalled ? 30 : 20)}  ${pc.dim(comp.description)}${deps}`
  })

  p.note(rows.join('\n'), `${components.length} components available`)

  if (!configExists()) {
    p.log.info(`Run ${pc.cyan('npx dt-ui init')} to get started.`)
  } else {
    p.log.info(`Run ${pc.cyan('npx dt-ui add <component>')} to install.`)
  }

  p.outro('')
}
