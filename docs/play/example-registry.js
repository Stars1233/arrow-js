import { playgroundExampleMeta, starterExampleId } from './example-meta'

const ENTRY_FILE = 'main.ts'
const exampleModules = import.meta.glob('./examples/**/*.{ts,css}', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const metaById = new Map(playgroundExampleMeta.map((example) => [example.id, example]))

function createExample(id, files) {
  const meta = metaById.get(id)

  if (!meta) {
    throw new Error(`Unknown playground example: ${id}`)
  }

  return {
    ...meta,
    entry: ENTRY_FILE,
    files,
  }
}

function getExampleFile(id, name) {
  const key = `./examples/${id}/${name}`
  const value = exampleModules[key]

  if (typeof value !== 'string') {
    throw new Error(`Missing playground example file: ${key}`)
  }

  return value.trimEnd() + '\n'
}

function createExampleFromDir(id, files) {
  return createExample(
    id,
    files.map((name) => [name, getExampleFile(id, name)])
  )
}

export const playgroundExamples = [
  createExampleFromDir(starterExampleId, [
    ENTRY_FILE,
    'App.ts',
    'CounterPanel.ts',
    'styles.css',
  ]),
  createExampleFromDir('calculator', [
    ENTRY_FILE,
    'CalculatorApp.ts',
    'CalculatorDisplay.ts',
    'Keypad.ts',
    'styles.css',
  ]),
  createExampleFromDir('performance', [
    ENTRY_FILE,
    'PerformanceBoard.ts',
    'FeedStats.ts',
    'TickerRow.ts',
    'styles.css',
  ]),
  createExampleFromDir('component-stability', [
    ENTRY_FILE,
    'StabilityLab.ts',
    'StableCounter.ts',
    'FrameCard.ts',
    'styles.css',
  ]),
  createExampleFromDir('dropdowns', [
    ENTRY_FILE,
    'Dropdown.ts',
    'DropdownGallery.ts',
    'FieldCard.ts',
    'styles.css',
  ]),
  createExampleFromDir('carousel', [
    ENTRY_FILE,
    'GalleryApp.ts',
    'Carousel.ts',
    'ThumbnailRail.ts',
    'slides.ts',
    'styles.css',
  ]),
  createExampleFromDir('tabs', [
    ENTRY_FILE,
    'TabsDemo.ts',
    'TabButton.ts',
    'styles.css',
  ]),
]

const exampleById = new Map(playgroundExamples.map((example) => [example.id, example]))

export function getPlaygroundExample(id) {
  return exampleById.get(id) ?? exampleById.get(starterExampleId)
}

export function cloneExampleFiles(files) {
  return files.map(([name, content]) => [name, content])
}

export { ENTRY_FILE }
