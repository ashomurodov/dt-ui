import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import {
  configExists,
  readConfig,
  detectPackageManager,
  getInstallCommand,
} from '../utils/config.js'
import {
  getStylesContent,
  getTableCellsContent,
  getLibContent,
  getComponentFiles,
  loadRegistry,
} from '../utils/registry.js'
import { rebuildAgentMd } from '../utils/agent.js'

export async function updateCommand() {
  p.intro(pc.bold(pc.cyan('dt-ui update')))

  if (!configExists()) {
    p.cancel('No .dtui.json found. Run `npx dt-ui init` first.')
    process.exit(1)
  }

  const config = readConfig()
  const registry = loadRegistry()
  const s = p.spinner()

  // Update base.css
  s.start('Updating base.css...')
  const stylesPath = path.resolve(process.cwd(), config.stylesDir)
  fs.mkdirSync(stylesPath, { recursive: true })
  fs.writeFileSync(
    path.join(stylesPath, 'base.css'),
    getStylesContent(),
    'utf-8',
  )
  s.stop('base.css updated')

  // Update table-cells.css
  const tableCellsContent = getTableCellsContent()
  if (tableCellsContent) {
    s.start('Updating table-cells.css...')
    fs.writeFileSync(
      path.join(stylesPath, 'table-cells.css'),
      tableCellsContent,
      'utf-8',
    )
    s.stop('table-cells.css updated')
  }

  // Update lib/utils.ts
  s.start('Updating lib/utils.ts...')
  const libPath = path.resolve(process.cwd(), config.libDir)
  fs.mkdirSync(libPath, { recursive: true })
  fs.writeFileSync(
    path.join(libPath, 'utils.ts'),
    getLibContent(),
    'utf-8',
  )
  s.stop('lib/utils.ts updated')

  // Offer to update installed components
  if (config.installedComponents.length > 0) {
    const updateComponents = await p.confirm({
      message: `Update ${config.installedComponents.length} installed component(s)? This will overwrite any local changes.`,
      initialValue: false,
    })

    if (!p.isCancel(updateComponents) && updateComponents) {
      const updatedComponents: string[] = []
      const allPackageDeps = new Set<string>()

      for (const componentName of config.installedComponents) {
        const comp = registry.components[componentName]
        if (!comp) continue

        s.start(`Updating ${pc.cyan(comp.name)}...`)
        const files = getComponentFiles(componentName)
        const targetDir = path.resolve(
          process.cwd(),
          config.componentsDir,
          componentName,
        )
        fs.mkdirSync(targetDir, { recursive: true })

        for (const file of files) {
          fs.writeFileSync(path.join(targetDir, file.name), file.content, 'utf-8')
        }

        for (const dep of comp.dependencies ?? []) {
          allPackageDeps.add(dep)
        }
        for (const dep of comp.peerDeps) {
          allPackageDeps.add(dep)
        }

        updatedComponents.push(componentName)
        s.stop(`${pc.green('✓')} ${comp.name} updated`)
      }

      if (allPackageDeps.size > 0) {
        const pm = detectPackageManager()
        const cmd = getInstallCommand(pm, [...allPackageDeps])
        s.start(`Installing package dependencies: ${[...allPackageDeps].join(', ')}...`)
        try {
          execSync(cmd, { cwd: process.cwd(), stdio: 'pipe' })
          s.stop('Package dependencies installed')
        } catch {
          s.stop(pc.yellow('Failed to install package dependencies. Please install manually:'))
          p.log.warn(pc.dim(cmd))
        }
      }

      if (updatedComponents.length > 0) {
        p.log.success(`${updatedComponents.length} component(s) updated`)
      }
    }
  }

  // Rebuild AGENT.md
  s.start('Rebuilding AGENT.md...')
  rebuildAgentMd(config)
  s.stop('AGENT.md rebuilt')

  p.note(
    [
      `${pc.green('✓')} base.css — latest design tokens`,
      `${pc.green('✓')} lib/utils.ts — latest helpers`,
      `${pc.green('✓')} AGENT.md — rebuilt with current components`,
    ].join('\n'),
    'Updated files',
  )

  p.outro(pc.green('dt-ui updated successfully!'))
}
