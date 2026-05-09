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

interface ComponentDiff {
  name: string
  displayName: string
  changedFiles: string[]
  totalFiles: number
}

/**
 * Diff a single installed component against the current registry.
 * Returns the names of files that differ (missing or content mismatch).
 */
function diffComponent(
  componentName: string,
  componentsDir: string,
): ComponentDiff | null {
  const registry = loadRegistry()
  const comp = registry.components[componentName]
  if (!comp) return null

  const files = getComponentFiles(componentName)
  const targetDir = path.resolve(process.cwd(), componentsDir, componentName)
  const changedFiles: string[] = []

  for (const file of files) {
    const localPath = path.join(targetDir, file.name)
    if (!fs.existsSync(localPath)) {
      changedFiles.push(file.name)
      continue
    }
    const localContent = fs.readFileSync(localPath, 'utf-8')
    if (localContent !== file.content) {
      changedFiles.push(file.name)
    }
  }

  return {
    name: componentName,
    displayName: comp.name,
    changedFiles,
    totalFiles: files.length,
  }
}

export async function updateCommand() {
  p.intro(pc.bold(pc.cyan('dt-ui update')))

  if (!configExists()) {
    p.cancel('No .dtui.json found. Run `npx dt-ui init` first.')
    process.exit(1)
  }

  const config = readConfig()
  const registry = loadRegistry()
  const s = p.spinner()

  // Refresh shared files (always safe — these are registry-managed, not authored).
  s.start('Updating base.css...')
  const stylesPath = path.resolve(process.cwd(), config.stylesDir)
  fs.mkdirSync(stylesPath, { recursive: true })
  fs.writeFileSync(
    path.join(stylesPath, 'base.css'),
    getStylesContent(),
    'utf-8',
  )
  s.stop('base.css updated')

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

  s.start('Updating lib/utils.ts...')
  const libPath = path.resolve(process.cwd(), config.libDir)
  fs.mkdirSync(libPath, { recursive: true })
  fs.writeFileSync(
    path.join(libPath, 'utils.ts'),
    getLibContent(),
    'utf-8',
  )
  s.stop('lib/utils.ts updated')

  // Diff each installed component against the registry.
  if (config.installedComponents.length > 0) {
    s.start(`Diffing ${config.installedComponents.length} installed component(s) against the registry...`)
    const diffs: ComponentDiff[] = []
    for (const name of config.installedComponents) {
      const diff = diffComponent(name, config.componentsDir)
      if (diff && diff.changedFiles.length > 0) diffs.push(diff)
    }
    s.stop(`${diffs.length} component(s) have updates available`)

    if (diffs.length === 0) {
      p.log.success('All installed components match the registry. Nothing to do.')
    } else {
      // Per-component multi-select. User picks which to overwrite.
      const selected = await p.multiselect({
        message: pc.yellow(
          `Pick components to overwrite. ${pc.dim('(Space to toggle, Enter to confirm)')}\n` +
            `${pc.red('Local edits will be lost.')} Default selection is empty for safety.`,
        ),
        options: diffs.map((d) => ({
          value: d.name,
          label: `${pc.cyan(d.displayName)} ${pc.dim(`(${d.changedFiles.length}/${d.totalFiles} file(s) differ)`)}`,
          hint: d.changedFiles.join(', '),
        })),
        required: false,
      })

      if (p.isCancel(selected)) {
        p.cancel('Component update cancelled. Shared files were still updated.')
        process.exit(0)
      }

      const toUpdate = (selected as string[]) ?? []

      if (toUpdate.length === 0) {
        p.log.info('No components selected — skipping component overwrites.')
      } else {
        const updated: string[] = []
        const allPackageDeps = new Set<string>()

        for (const componentName of toUpdate) {
          const comp = registry.components[componentName]
          if (!comp) continue

          s.start(`Overwriting ${pc.cyan(comp.name)}...`)
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

          for (const dep of comp.dependencies ?? []) allPackageDeps.add(dep)
          for (const dep of comp.peerDeps) allPackageDeps.add(dep)

          updated.push(componentName)
          s.stop(`${pc.green('✓')} ${comp.name} overwritten`)
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

        p.log.success(`${updated.length} component(s) overwritten with the latest registry version.`)
      }
    }
  }

  // Rebuild AGENT.md (cheap, deterministic).
  s.start('Rebuilding AGENT.md...')
  rebuildAgentMd(config)
  s.stop('AGENT.md rebuilt')

  p.outro(pc.green('dt-ui update complete.'))
}
