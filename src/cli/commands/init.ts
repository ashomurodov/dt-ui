import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import {
  configExists,
  writeConfig,
  detectFramework,
  type DtUiConfig,
} from '../utils/config.js'

type DetectedFramework = ReturnType<typeof detectFramework>
import { getStylesContent, getTableCellsContent, getLibContent } from '../utils/registry.js'
import { createAgentMd } from '../utils/agent.js'

export async function initCommand() {
  p.intro(pc.bold(pc.cyan('dt-ui init')))

  if (configExists()) {
    const overwrite = await p.confirm({
      message: 'A .dtui.json config already exists. Overwrite?',
      initialValue: false,
    })
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Init cancelled.')
      process.exit(0)
    }
  }

  const detectedFramework: DetectedFramework = detectFramework()
  const frameworkLabel: Record<DetectedFramework, string> = {
    nuxt: 'Nuxt',
    'vue-vite': 'Vue + Vite',
    vue: 'Vue (plain)',
  }
  p.log.info(`Detected framework: ${pc.cyan(frameworkLabel[detectedFramework])}`)

  const answers = await p.group(
    {
      componentsDir: () =>
        p.text({
          message: 'Where should components be installed?',
          initialValue: 'src/components/ui',
          placeholder: 'src/components/ui',
        }),
      libDir: () =>
        p.text({
          message: 'Where should lib utils go?',
          initialValue: 'src/lib',
          placeholder: 'src/lib',
        }),
    },
    {
      onCancel: () => {
        p.cancel('Init cancelled.')
        process.exit(0)
      },
    },
  )

  const stylesDir = 'src/styles'

  const config: DtUiConfig = {
    componentsDir: answers.componentsDir as string,
    libDir: answers.libDir as string,
    stylesDir,
    installedComponents: [],
    agent: true,
  }

  const s = p.spinner()

  // Write config
  writeConfig(config)

  // Copy base.css
  s.start('Copying base.css...')
  const stylesPath = path.resolve(process.cwd(), stylesDir)
  fs.mkdirSync(stylesPath, { recursive: true })
  fs.writeFileSync(
    path.join(stylesPath, 'base.css'),
    getStylesContent(),
    'utf-8',
  )
  s.stop('base.css copied')

  // Copy table-cells.css
  const tableCellsContent = getTableCellsContent()
  if (tableCellsContent) {
    s.start('Copying table-cells.css...')
    fs.writeFileSync(
      path.join(stylesPath, 'table-cells.css'),
      tableCellsContent,
      'utf-8',
    )
    s.stop('table-cells.css copied')
  }

  // Copy lib/utils.ts
  s.start('Copying lib/utils.ts...')
  const libPath = path.resolve(process.cwd(), answers.libDir as string)
  fs.mkdirSync(libPath, { recursive: true })
  fs.writeFileSync(
    path.join(libPath, 'utils.ts'),
    getLibContent(),
    'utf-8',
  )
  s.stop('lib/utils.ts copied')

  // Create AGENT.md
  s.start('Creating AGENT.md...')
  createAgentMd()
  s.stop('AGENT.md created')

  p.note(
    [
      `${pc.bold('Next steps:')}`,
      '',
      `1. Import base.css in your main entry file:`,
      `   ${pc.cyan("import './styles/base.css'")}` ,
      '',
      `2. Add your first component:`,
      `   ${pc.cyan('npx dt-ui add button')}`,
      '',
      `3. Use it in your Vue components:`,
      `   ${pc.cyan("<DtButton variant=\"default\">Click me</DtButton>")}`,
    ].join('\n'),
    'Setup complete!',
  )

  p.outro(pc.green('dt-ui initialized successfully!'))
}
