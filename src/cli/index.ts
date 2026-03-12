#!/usr/bin/env node
import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'

const program = new Command()

program
  .name('dt-ui')
  .description('DT UI — Lightweight, customizable Vue components for DT projects')
  .version('0.1.0')

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

program.parse()
