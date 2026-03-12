import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import {
  configExists,
  readConfig,
} from '../utils/config.js'
import { getStylesContent, getLibContent } from '../utils/registry.js'
import { rebuildAgentMd } from '../utils/agent.js'

export async function updateCommand() {
  p.intro(pc.bold(pc.cyan('dt-ui update')))

  if (!configExists()) {
    p.cancel('No .dtui.json found. Run `npx dt-ui init` first.')
    process.exit(1)
  }

  const config = readConfig()
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

  // Rebuild AGENT.md
  if (config.agent) {
    s.start('Rebuilding AGENT.md...')
    rebuildAgentMd(config)
    s.stop('AGENT.md rebuilt')
  }

  p.note(
    [
      `${pc.green('✓')} base.css — latest design tokens`,
      `${pc.green('✓')} lib/utils.ts — latest helpers`,
      config.agent ? `${pc.green('✓')} AGENT.md — rebuilt with current components` : '',
    ].filter(Boolean).join('\n'),
    'Updated files',
  )

  p.outro(pc.green('dt-ui updated successfully!'))
}
