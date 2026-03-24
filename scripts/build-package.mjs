import path from 'node:path'
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageDir = process.cwd()
const distDir = path.resolve(packageDir, 'dist')
const configPath = path.resolve(__dirname, 'rollup-package.config.mjs')

const entries = Object.fromEntries(
  process.argv.slice(2).map(parseEntryArgument)
)

if (!Object.keys(entries).length) {
  throw new Error('Missing package entrypoints. Use name=src/file.ts arguments.')
}

await rm(distDir, {
  force: true,
  recursive: true,
})

await runRollup()
await runRollup('types')

await rm(path.resolve(distDir, 'types'), {
  force: true,
  recursive: true,
})

function parseEntryArgument(argument) {
  const separatorIndex = argument.indexOf('=')

  if (separatorIndex <= 0 || separatorIndex === argument.length - 1) {
    throw new Error(
      `Invalid entrypoint "${argument}". Use name=src/file.ts.`
    )
  }

  return [argument.slice(0, separatorIndex), argument.slice(separatorIndex + 1)]
}

async function runRollup(build) {
  const env = {
    ...process.env,
    ARROW_PACKAGE_ENTRIES: JSON.stringify(entries),
  }

  if (build) {
    env.ARROW_PACKAGE_BUILD = build
  }

  await execa(
    'npx',
    ['rollup', '-c', configPath],
    {
      cwd: packageDir,
      env,
      stdio: 'inherit',
    }
  )
}
