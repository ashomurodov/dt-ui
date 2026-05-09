#!/usr/bin/env node
import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { updateCommand } from './commands/update.js'
import pkg from '../../package.json' with { type: 'json' }

const program = new Command()

program
  .name('dt-ui')
  .description('DT UI — Lightweight, customizable Vue components for DT projects')
  .version(pkg.version)

program
  .command('init')
  .description('Initialize dt-ui in your project')
  .action(initCommand)

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Component names to add')
  .action(addCommand)

program
  .command('list')
  .description('List all available components')
  .action(listCommand)

program
  .command('update')
  .description('Update base.css, utils, and AGENT.md to latest version')
  .action(updateCommand)

program.parse()
