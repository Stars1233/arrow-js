#!/usr/bin/env node

import process from 'node:process'
import { scaffoldArrowApp } from './scaffold.js'

const args = process.argv.slice(2)
let targetDir = ''

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]

  if (!targetDir && !arg.startsWith('-')) {
    targetDir = arg
    continue
  }

  if (arg === '--help' || arg === '-h') {
    printHelp()
    process.exit(0)
  }

  throw new Error(`Unknown argument "${arg}".`)
}

targetDir = targetDir || 'arrow-app'

try {
  const result = await scaffoldArrowApp(targetDir)

  const relativeTarget = result.relativeTargetDir === '.'
    ? result.projectName
    : result.relativeTargetDir

  process.stdout.write(
    [
      '',
      `Arrow app scaffolded in ${result.targetDir}`,
      '',
      'Next steps:',
      `  cd ${relativeTarget}`,
      '  pnpm install',
      '  pnpm dev',
      '',
    ].join('\n')
  )
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`
  )
  process.exit(1)
}

function printHelp() {
  process.stdout.write(
    [
      'Usage: create-arrow-js [project-name]',
      '',
    ].join('\n')
  )
}
