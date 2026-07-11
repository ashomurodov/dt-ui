import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Regression for the `npx dt-ui update` staleness bug.
 *
 * `update` runs `npm install aetherx-dt-ui@latest`, then reads the registry. If
 * the registry is resolved from the RUNNING CLI module (`import.meta.url`), the
 * command reads the OLD version's files — because under pnpm the freshly-installed
 * version lives at a different store path while `npx` keeps executing the old
 * binary. It then copies stale components and reports success.
 *
 * The fix resolves the registry from the consumer's cwd (`createRequire`), so an
 * installed newer package wins over the CLI's own bundled copy. This test builds
 * that split by hand — a "running CLI" in one dir, a newer installed package in
 * the consumer's node_modules — and asserts resolution picks the installed one,
 * and falls back to the bundled copy when nothing is installed.
 */
const PROBE = `
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const PACKAGE_NAME = 'aetherx-dt-ui'
function getRegistryDir() {
  try {
    const requireFromCwd = createRequire(path.join(process.cwd(), 'noop.js'))
    const pkgJson = requireFromCwd.resolve(\`\${PACKAGE_NAME}/package.json\`)
    const installedRegistry = path.join(path.dirname(pkgJson), 'src/registry')
    if (fs.existsSync(path.join(installedRegistry, 'registry.json'))) return installedRegistry
  } catch {}
  const cliDir = path.dirname(fileURLToPath(import.meta.url))
  for (const c of [
    path.resolve(cliDir, '../../src/registry'),
    path.resolve(cliDir, '../../registry'),
    path.resolve(cliDir, '../../../src/registry'),
  ]) if (fs.existsSync(path.join(c, 'registry.json'))) return c
  throw new Error('not found')
}
const dir = getRegistryDir()
process.stdout.write(JSON.parse(fs.readFileSync(path.join(dir, 'registry.json'), 'utf8')).marker)
`

let root: string

beforeAll(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'dtui-cli-'))

  // The "running CLI" module dir, with its OWN bundled registry (marker: OLD).
  fs.mkdirSync(path.join(root, 'oldcli/dist/cli'), { recursive: true })
  fs.mkdirSync(path.join(root, 'oldcli/src/registry'), { recursive: true })
  fs.writeFileSync(
    path.join(root, 'oldcli/src/registry/registry.json'),
    JSON.stringify({ marker: 'OLD' }),
  )
  fs.writeFileSync(path.join(root, 'oldcli/dist/cli/probe.mjs'), PROBE)

  // A consumer whose INSTALLED package carries a NEWER registry (marker: NEW).
  const installed = path.join(root, 'consumer/node_modules/aetherx-dt-ui')
  fs.mkdirSync(path.join(installed, 'src/registry'), { recursive: true })
  fs.writeFileSync(
    path.join(installed, 'package.json'),
    JSON.stringify({ name: 'aetherx-dt-ui', version: '9.9.9' }),
  )
  fs.writeFileSync(
    path.join(installed, 'src/registry/registry.json'),
    JSON.stringify({ marker: 'NEW' }),
  )

  // An empty consumer with nothing installed.
  fs.mkdirSync(path.join(root, 'empty'), { recursive: true })
})

afterAll(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

const runFrom = (cwd: string) =>
  execFileSync('node', [path.join(root, 'oldcli/dist/cli/probe.mjs')], {
    cwd,
    encoding: 'utf-8',
  })

describe('CLI registry resolution', () => {
  it('prefers the consumer’s installed package over the running CLI’s bundled copy', () => {
    // The exact pnpm shape: old CLI running, newer package installed elsewhere.
    expect(runFrom(path.join(root, 'consumer'))).toBe('NEW')
  })

  it('falls back to the CLI’s bundled registry when nothing is installed', () => {
    expect(runFrom(path.join(root, 'empty'))).toBe('OLD')
  })
})
