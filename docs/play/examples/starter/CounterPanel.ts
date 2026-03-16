import { component, html, reactive } from '@arrow-js/core'

export const CounterPanel = component((props: { model: { count: number } }) => {
  const local = reactive({
    clicks: 0,
  })

  return html`<section class="starter-panel">
    <div>
      <p class="starter-panel__label">Shared count</p>
      <strong class="starter-panel__value">${() => props.model.count}</strong>
    </div>
    <div class="starter-panel__actions">
      <button class="starter-button" @click="${() => props.model.count--}">
        Decrement
      </button>
      <button class="starter-button" @click="${() => props.model.count++}">
        Increment
      </button>
      <button class="starter-button starter-button--ghost" @click="${() => local.clicks++}">
        Local clicks ${() => local.clicks}
      </button>
    </div>
  </section>`
})
