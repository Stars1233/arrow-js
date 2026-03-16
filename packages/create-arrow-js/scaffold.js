import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.dirname(fileURLToPath(import.meta.url))
const templateRoot = path.resolve(packageRoot, 'template')

const arrowPackages = [
  '@arrow-js/core',
  '@arrow-js/framework',
  '@arrow-js/hydrate',
  '@arrow-js/ssr',
]

const toolVersions = {
  nodeTypes: '^22.16.5',
  typescript: '^5.9.3',
  vite: '^8.0.0',
}

export async function scaffoldArrowApp(
  targetDir,
  options = {}
) {
  const projectName = sanitizeProjectName(path.basename(path.resolve(targetDir)))
  const resolvedTargetDir = path.resolve(targetDir)
  const relativeTargetDir = normalizePath(
    path.relative(process.cwd(), resolvedTargetDir) || '.'
  )
  const arrowVersion = options.arrowVersion ?? await readPackageVersion()

  await ensureTargetDir(resolvedTargetDir)

  const dependencyVersions = createArrowDependencyVersions(arrowVersion)

  const replacements = {
    __PACKAGE_NAME__: projectName,
    __ARROW_CORE__: dependencyVersions['@arrow-js/core'],
    __ARROW_FRAMEWORK__: dependencyVersions['@arrow-js/framework'],
    __ARROW_HYDRATE__: dependencyVersions['@arrow-js/hydrate'],
    __ARROW_SSR__: dependencyVersions['@arrow-js/ssr'],
    __TYPES_NODE_VERSION__: toolVersions.nodeTypes,
    __TYPESCRIPT_VERSION__: toolVersions.typescript,
    __VITE_VERSION__: toolVersions.vite,
  }

  await copyTemplate(templateRoot, resolvedTargetDir, replacements)

  return {
    projectName,
    relativeTargetDir,
    targetDir: resolvedTargetDir,
  }
}

async function ensureTargetDir(targetDir) {
  try {
    const entries = await fs.readdir(targetDir)
    if (entries.length > 0) {
      throw new Error(`Target directory "${targetDir}" is not empty.`)
    }
  } catch (error) {
    if (isMissingPathError(error)) {
      await fs.mkdir(targetDir, { recursive: true })
      return
    }

    throw error
  }
}

async function readPackageVersion() {
  const packageJsonPath = path.resolve(packageRoot, 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  return packageJson.version
}

function createArrowDependencyVersions(arrowVersion) {
  const version = `^${arrowVersion}`
  return Object.fromEntries(
    arrowPackages.map((packageName) => [packageName, version])
  )
}

async function copyTemplate(sourceDir, targetDir, replacements) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.resolve(sourceDir, entry.name)
    const targetName = entry.name === '_gitignore' ? '.gitignore' : entry.name
    const targetPath = path.resolve(targetDir, targetName)

    if (entry.isDirectory()) {
      await fs.mkdir(targetPath, { recursive: true })
      await copyTemplate(sourcePath, targetPath, replacements)
      continue
    }

    const source = await fs.readFile(sourcePath, 'utf8')
    await fs.writeFile(targetPath, applyReplacements(source, replacements))
  }
}

function applyReplacements(source, replacements) {
  return Object.entries(replacements).reduce(
    (value, [token, replacement]) => value.replaceAll(token, replacement),
    source
  )
}

function sanitizeProjectName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'arrow-app'
}

function isMissingPathError(error) {
  return !!error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT'
}

function normalizePath(value) {
  return value.replace(/\\/g, '/')
}
