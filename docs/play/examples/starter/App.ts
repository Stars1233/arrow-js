import { component, html, reactive } from '@arrow-js/core'
import { CounterPanel } from './CounterPanel'

const state = reactive({
  count: 2,
  notes: [
    { id: 1, label: 'Templates stay static unless you opt into live expressions.' },
    { id: 2, label: 'Component instances keep their local state by slot.' },
    { id: 3, label: 'The rest of the stack can stay in separate packages.' },
  ],
})

export const App = component(() =>
  html`<main class="starter-shell">
    <section class="starter-hero">
      <p class="starter-eyebrow">Arrow Playground</p>
      <h1>Start with a few components and a reactive object.</h1>
      <p class="starter-copy">
        This starter keeps shared state in one place and lets a child component
        own its own local counter.
      </p>
      ${CounterPanel({ model: state })}
    </section>

    <section class="starter-card">
      <h2>What you get</h2>
      <ul class="starter-list">
        ${() =>
          state.notes.map((note) => html`<li>${note.label}</li>`.key(note.id))}
      </ul>
    </section>
  </main>`
)
