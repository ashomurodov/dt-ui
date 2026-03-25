import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import {
  configExists,
  readConfig,
  writeConfig,
  detectPackageManager,
  getInstallCommand,
} from '../utils/config.js'
import {
  loadRegistry,
  getComponentFiles,
  getAllComponentNames,
} from '../utils/registry.js'
import { appendComponentDoc } from '../utils/agent.js'

export async function addCommand(componentNames: string[]) {
  p.intro(pc.bold(pc.cyan('dt-ui add')))

  if (!configExists()) {
    p.cancel('No .dtui.json found. Run `npx dt-ui init` first.')
    process.exit(1)
  }

  const config = readConfig()
  const registry = loadRegistry()
  const allNames = getAllComponentNames()

  // If no components specified, show a multi-select
  if (!componentNames || componentNames.length === 0) {
    const selected = await p.multiselect({
      message: 'Which components would you like to add?',
      options: allNames.map((name) => ({
        value: name,
        label: registry.components[name].name,
        hint: config.installedComponents.includes(name) ? 'installed' : undefined,
      })),
      required: true,
    })

    if (p.isCancel(selected)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }

    componentNames = selected as string[]
  }

  // Validate all component names
  const invalid = componentNames.filter((n) => !registry.components[n])
  if (invalid.length > 0) {
    p.cancel(
      `Unknown component(s): ${invalid.map((n) => pc.red(n)).join(', ')}. Run ${pc.cyan('npx dt-ui list')} to see available components.`,
    )
    process.exit(1)
  }

  // Resolve internal dependencies
  const toInstall = new Set<string>()
  const depQueue = [...componentNames]

  while (depQueue.length > 0) {
    const name = depQueue.pop()!
    if (toInstall.has(name)) continue
    toInstall.add(name)
    const comp = registry.components[name]
    for (const dep of comp.internalDeps) {
      if (!toInstall.has(dep) && !config.installedComponents.includes(dep)) {
        depQueue.push(dep)
      }
    }
  }

  // If we resolved extra deps, confirm with user
  const extraDeps = [...toInstall].filter((n) => !componentNames.includes(n))
  if (extraDeps.length > 0) {
    const confirmDeps = await p.confirm({
      message: `The following dependencies are also required: ${extraDeps.map((n) => pc.cyan(n)).join(', ')}. Install them too?`,
      initialValue: true,
    })

    if (p.isCancel(confirmDeps)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }

    if (!confirmDeps) {
      // Remove deps that user declined
      for (const dep of extraDeps) {
        toInstall.delete(dep)
      }
    }
  }

  // Check for already installed, ask to overwrite
  const alreadyInstalled = [...toInstall].filter((n) =>
    config.installedComponents.includes(n),
  )
  if (alreadyInstalled.length > 0) {
    const overwrite = await p.confirm({
      message: `${alreadyInstalled.map((n) => pc.yellow(n)).join(', ')} already installed. Overwrite?`,
      initialValue: false,
    })

    if (p.isCancel(overwrite) || !overwrite) {
      for (const name of alreadyInstalled) {
        toInstall.delete(name)
      }
    }
  }

  if (toInstall.size === 0) {
    p.cancel('Nothing to install.')
    process.exit(0)
  }

  const s = p.spinner()
  const allPeerDeps = new Set<string>()
  const installed: string[] = []

  for (const componentName of toInstall) {
    const comp = registry.components[componentName]
    s.start(`Installing ${pc.cyan(comp.name)}...`)

    // Copy component files
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

    // Collect peer deps
    for (const dep of comp.peerDeps) {
      allPeerDeps.add(dep)
    }

    // Update config
    if (!config.installedComponents.includes(componentName)) {
      config.installedComponents.push(componentName)
    }

    // Append docs to AGENT.md
    appendComponentDoc(componentName)

    installed.push(componentName)
    s.stop(`${pc.green('✓')} ${comp.name} installed`)
  }

  // Install peer deps if any
  if (allPeerDeps.size > 0) {
    const pm = detectPackageManager()
    const cmd = getInstallCommand(pm, [...allPeerDeps])
    s.start(`Installing peer dependencies: ${[...allPeerDeps].join(', ')}...`)
    try {
      execSync(cmd, { cwd: process.cwd(), stdio: 'pipe' })
      s.stop('Peer dependencies installed')
    } catch {
      s.stop(pc.yellow('Failed to install peer dependencies. Please install manually:'))
      p.log.warn(pc.dim(cmd))
    }
  }

  // Save config
  writeConfig(config)

  p.note(
    installed
      .map((name) => {
        const comp = registry.components[name]
        return `${pc.green('✓')} ${comp.name} → ${config.componentsDir}/${name}/`
      })
      .join('\n'),
    'Installed components',
  )

  p.outro(pc.green(`${installed.length} component(s) added successfully!`))
}
