import { reactive, watch } from '@src/index'

export default function createDocsStore() {
  const store = reactive({
    section: 'what-is-arrow',
    navigation: [
      {
        title: 'Essentials',
        id: 'essentials',
        children: [
          { title: 'What is Arrow', id: 'what-is-arrow' },
          { title: 'Quickstart', id: 'quick-start' },
          { title: 'Components', id: 'components' },
        ],
      },
      {
        title: 'API',
        id: 'api',
        children: [
          { title: 'Reactive (r)', id: 'reactive-data' },
          { title: 'Watch (w)', id: 'watching-data' },
          { title: 'HTML (t)', id: 'templates' },
          { title: 'SSR', id: 'ssr' },
          { title: 'Hydration', id: 'hydration' },
          { title: 'Ecosystem', id: 'ecosystem' },
        ],
      },
      {
        title: 'Examples',
        id: 'examples',
      },
    ],
  })

  watch(() => {
    if (store.section === undefined) {
      store.section = store.navigation[0].id
    }
  })

  return store
}
