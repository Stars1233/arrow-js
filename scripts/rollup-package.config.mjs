import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const packageRoot = process.cwd()
const distDir = path.resolve(packageRoot, 'dist')
const tsconfigPath = path.resolve(packageRoot, 'tsconfig.json')
const typesDir = path.resolve(distDir, 'types')
const build = process.env.ARROW_PACKAGE_BUILD
const isTypesBuild = build === 'types'
const entries = parseEntries(process.env.ARROW_PACKAGE_ENTRIES)

const input = isTypesBuild
  ? Object.fromEntries(
      Object.keys(entries).map((name) => [name, path.resolve(typesDir, `${name}.d.ts`)])
    )
  : Object.fromEntries(
      Object.entries(entries).map(([name, source]) => [name, path.resolve(packageRoot, source)])
    )

const output = isTypesBuild
  ? {
      dir: distDir,
      entryFileNames: '[name].d.ts',
      format: 'es',
    }
  : {
      chunkFileNames: 'chunks/[name]-[hash].mjs',
      dir: distDir,
      entryFileNames: '[name].mjs',
      format: 'es',
      sourcemap: true,
    }

const plugins = isTypesBuild
  ? [
      dts({
        respectExternal: true,
        tsconfig: tsconfigPath,
      }),
    ]
  : [
      typescript({
        declaration: true,
        declarationDir: typesDir,
        declarationMap: false,
        exclude: ['**/*.spec.ts'],
        outDir: distDir,
        sourceMap: true,
        tsconfig: tsconfigPath,
      }),
    ]

export default defineConfig({
  external: isExternal,
  input,
  output,
  plugins,
  treeshake: {
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
})

function parseEntries(rawEntries = '{}') {
  const parsed = JSON.parse(rawEntries)

  if (!Object.keys(parsed).length) {
    throw new Error('Missing ARROW_PACKAGE_ENTRIES.')
  }

  return parsed
}

function isExternal(id) {
  return !id.startsWith('.') && !path.isAbsolute(id)
}
