import { component, html } from '@arrow-js/core'
import { Dropdown } from './Dropdown'
import { FieldCard } from './FieldCard'

const groups = [
  {
    id: 'planets',
    title: 'Planets',
    description: 'One dropdown can stay simple and self-contained.',
    options: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'],
  },
  {
    id: 'cities',
    title: 'Cities',
    description: 'The same component can be reused without shared state leaks.',
    options: ['Amsterdam', 'Berlin', 'Lisbon', 'Los Angeles', 'Seoul', 'Tokyo'],
  },
  {
    id: 'teams',
    title: 'Teams',
    description: 'Filtering is local to each instance because the slot owns its state.',
    options: ['Bluebirds', 'Comets', 'Falcons', 'Owls', 'Waves', 'Zephyrs'],
  },
]

export const DropdownGallery = component(() =>
  html`<main class="dropdowns-shell">
    <section class="dropdowns-header">
      <p class="dropdowns-eyebrow">Dropdowns</p>
      <h1>Reusable components with isolated local state.</h1>
      <p>
        Each card renders the same dropdown primitive. Open, filter, and select
        independently to see how component instances stay separate.
      </p>
    </section>

    <section class="dropdowns-grid">
      ${groups.map((group) =>
        FieldCard({
          content: Dropdown({
            label: `Choose a ${group.title.toLowerCase().slice(0, -1)}`,
            options: group.options,
          }),
          description: group.description,
          title: group.title,
        }).key(group.id)
      )}
    </section>
  </main>`
)
