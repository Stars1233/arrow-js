export const starterExampleId = 'starter'
const examplesBaseUrl =
  'https://github.com/justin-schroeder/arrow-js/tree/master/docs/play/examples'

export const playgroundExampleMeta = [
  {
    id: starterExampleId,
    title: 'Starter',
    description: 'A compact multi-file starter with shared state and a local component.',
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A polished calculator split into display and keypad components.',
    sourceUrl: `${examplesBaseUrl}/calculator`,
  },
  {
    id: 'performance',
    title: 'Performance',
    description:
      'A live data board with componentized rows and reactive throughput stats.',
    sourceUrl: `${examplesBaseUrl}/performance`,
  },
  {
    id: 'component-stability',
    title: 'Component Stability',
    description:
      'A nested state lab showing what survives parent rerenders and what resets on unmount.',
    sourceUrl: `${examplesBaseUrl}/component-stability`,
  },
  {
    id: 'dropdowns',
    title: 'Dropdowns',
    description:
      'A small UI library example with reusable dropdown and card components.',
    sourceUrl: `${examplesBaseUrl}/dropdowns`,
  },
  {
    id: 'carousel',
    title: 'Carousel',
    description: 'A media carousel with thumbnail navigation and a details panel.',
    sourceUrl: `${examplesBaseUrl}/carousel`,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'A tabbed workspace composed from focused button and panel components.',
    sourceUrl: `${examplesBaseUrl}/tabs`,
  },
]

export const docsExampleMeta = playgroundExampleMeta.filter(
  (example) => example.id !== starterExampleId
)

export function playgroundExampleHref(id) {
  return id === starterExampleId
    ? '/play/'
    : `/play/?example=${encodeURIComponent(id)}`
}
