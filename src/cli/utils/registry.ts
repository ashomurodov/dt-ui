import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface ComponentEntry {
  name: string
  description: string
  files: string[]
  internalDeps: string[]
  peerDeps: string[]
  docs: string
}

export interface Registry {
  components: Record<string, ComponentEntry>
}

function getRegistryDir(): string {
  // In dev: src/registry, in dist: src/registry (included via package.json files)
  const thisFile = fileURLToPath(import.meta.url)
  const cliDir = path.dirname(thisFile)

  // Try multiple possible locations
  const candidates = [
    // When running from built dist/
    path.resolve(cliDir, '../../src/registry'),
    // When running from src/cli/utils/
    path.resolve(cliDir, '../../registry'),
    // When running via unbuild stub
    path.resolve(cliDir, '../../../src/registry'),
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
