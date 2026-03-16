import { component, html, reactive } from '@arrow-js/core'
import { TabButton } from './TabButton'

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    title: 'Overview',
    copy: 'Keep the high-level story here. This is the first panel users read.',
  },
  {
    id: 'activity',
    label: 'Activity',
    title: 'Activity',
    copy: 'Arrow only keeps the active branch live, so the switch stays simple and direct.',
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Settings',
    copy: 'Use components for the shell, then swap content with normal template expressions.',
  },
]

export const TabsDemo = component(() => {
  const state = reactive({
    current: 'overview',
  })

  const currentTab = () => tabs.find((tab) => tab.id === state.current) ?? tabs[0]

  return html`<main class="tabs-shell">
    <section class="tabs-header">
      <p class="tabs-eyebrow">Tabs</p>
      <h1>Small components for the chrome, plain reactivity for the panel.</h1>
    </section>

    <section class="tabs-card">
      <nav class="tabs-nav">
        ${tabs.map((tab) =>
          TabButton({
            current: state.current,
            id: tab.id,
            label: tab.label,
            onSelect(id: string) {
              state.current = id
            },
          }).key(tab.id)
        )}
      </nav>

      <article class="tabs-panel">
        <p class="tabs-panel__eyebrow">${() => currentTab().label}</p>
        <h2>${() => currentTab().title}</h2>
        <p>${() => currentTab().copy}</p>
      </article>
    </section>
  </main>`
})
