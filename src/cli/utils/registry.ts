import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_NAME = 'aetherx-dt-ui'

export interface ComponentEntry {
  name: string
  description: string
  files: string[]
  internalDeps: string[]
  dependencies?: string[]
  peerDeps: string[]
  docs: string
}

export interface Registry {
  components: Record<string, ComponentEntry>
}

/**
 * Locate the registry the CONSUMER has installed, resolved from their project cwd
 * — not from wherever this CLI module happens to live.
 *
 * This distinction is the whole ballgame for `update`. `npx dt-ui update` first
 * `npm install`s `aetherx-dt-ui@latest`, then reads the registry. If we resolve
 * relative to `import.meta.url`, we read the files of the ALREADY-RUNNING process,
 * which is the OLD version — under pnpm every version has its own store path, so
 * `npx` keeps executing the old binary while the new one sits unused in
 * node_modules. The command then copies stale components and cheerfully reports
 * success. (Under npm's flat node_modules the two paths coincide, which is why
 * this hid for so long.)
 *
 * So: resolve the installed package from the user's cwd first. Fall back to the
 * CLI's own bundled copy only when the package isn't a dependency (e.g. `npx`
 * one-shot with nothing installed yet).
 */
export function getRegistryDir(): string {
  // 1. The registry inside the consumer's installed package (the source of truth
  //    after `update` bumps the version). `createRequire` rooted at cwd walks the
  //    real node_modules resolution, pnpm symlinks included.
  try {
    const requireFromCwd = createRequire(path.join(process.cwd(), 'noop.js'))
    const pkgJson = requireFromCwd.resolve(`${PACKAGE_NAME}/package.json`)
    const installedRegistry = path.join(path.dirname(pkgJson), 'src/registry')
    if (fs.existsSync(path.join(installedRegistry, 'registry.json'))) {
      return installedRegistry
    }
  } catch {
    // Not installed in this project — fall through to the bundled copy.
  }

  // 2. This CLI's own bundled registry (dev, or `npx` with nothing installed).
  const cliDir = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(cliDir, '../../src/registry'), // built dist/
    path.resolve(cliDir, '../../registry'), // src/cli/utils/
    path.resolve(cliDir, '../../../src/registry'), // unbuild stub
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'registry.json'))) {
      return candidate
    }
  }

  throw new Error('Could not find registry directory. Make sure dt-ui is installed correctly.')
}

export function loadRegistry(): Registry {
  const registryDir = getRegistryDir()
  const registryPath = path.join(registryDir, 'registry.json')
  const raw = fs.readFileSync(registryPath, 'utf-8')
  return JSON.parse(raw) as Registry
}

export function getComponentFiles(componentName: string): { name: string; content: string }[] {
  const registryDir = getRegistryDir()
  const registry = loadRegistry()
  const component = registry.components[componentName]

  if (!component) {
    throw new Error(`Component "${componentName}" not found in registry.`)
  }

  return component.files.map((fileName) => {
    const filePath = path.join(registryDir, 'components', componentName, fileName)
    return {
      name: fileName,
      content: fs.readFileSync(filePath, 'utf-8'),
    }
  })
}

export function getStylesContent(): string {
  const registryDir = getRegistryDir()
  return fs.readFileSync(path.join(registryDir, 'styles', 'base.css'), 'utf-8')
}

export function getTableCellsContent(): string {
  const registryDir = getRegistryDir()
  const filePath = path.join(registryDir, 'styles', 'table-cells.css')
  if (!fs.existsSync(filePath)) return ''
  return fs.readFileSync(filePath, 'utf-8')
}

export function getLibContent(): string {
  const registryDir = getRegistryDir()
  return fs.readFileSync(path.join(registryDir, 'lib', 'utils.ts'), 'utf-8')
}

export function getDocContent(docsPath: string): string {
  const registryDir = getRegistryDir()
  const fullPath = path.join(registryDir, docsPath)
  if (!fs.existsSync(fullPath)) {
    return ''
  }
  return fs.readFileSync(fullPath, 'utf-8')
}

export function getAllComponentNames(): string[] {
  const registry = loadRegistry()
  return Object.keys(registry.components)
}
