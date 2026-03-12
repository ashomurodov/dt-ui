import fs from 'node:fs'
import path from 'node:path'

export interface DtUiConfig {
  framework: 'nuxt' | 'vue-vite' | 'vue'
  componentsDir: string
  libDir: string
  stylesDir: string
  installedComponents: string[]
  agent: boolean
}

const CONFIG_FILE = '.dtui.json'

export function getConfigPath(): string {
  return path.resolve(process.cwd(), CONFIG_FILE)
}

export function configExists(): boolean {
  return fs.existsSync(getConfigPath())
}

export function readConfig(): DtUiConfig {
  const configPath = getConfigPath()
  if (!fs.existsSync(configPath)) {
    throw new Error('No .dtui.json found. Run `npx dt-ui init` first.')
  }
  const raw = fs.readFileSync(configPath, 'utf-8')
  return JSON.parse(raw) as DtUiConfig
}

export function writeConfig(config: DtUiConfig): void {
  const configPath = getConfigPath()
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
}

export function detectFramework(): 'nuxt' | 'vue-vite' | 'vue' {
  const cwd = process.cwd()

  // Check for Nuxt
  if (
    fs.existsSync(path.join(cwd, 'nuxt.config.ts')) ||
    fs.existsSync(path.join(cwd, 'nuxt.config.js'))
  ) {
    return 'nuxt'
  }

  // Check for Vite (with Vue)
  if (
    fs.existsSync(path.join(cwd, 'vite.config.ts')) ||
    fs.existsSync(path.join(cwd, 'vite.config.js'))
  ) {
    return 'vue-vite'
  }

  return 'vue'
}

export function detectPackageManager(): 'npm' | 'pnpm' | 'yarn' | 'bun' {
  const cwd = process.cwd()

  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
    return 'bun'
  }
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'npm'
}

export function getInstallCommand(pm: string, deps: string[]): string {
  const depStr = deps.join(' ')
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${depStr}`
    case 'yarn':
      return `yarn add ${depStr}`
    case 'bun':
      return `bun add ${depStr}`
    default:
      return `npm install ${depStr}`
  }
}
