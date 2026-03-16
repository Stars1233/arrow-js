import { component, html, reactive } from '@arrow-js/core'

export const StableCounter = component((props: { label: string }) => {
  const state = reactive({
    clicks: 0,
  })

  return html`<section class="stable-counter">
    <p>${() => props.label}</p>
    <strong>${() => state.clicks}</strong>
    <button class="stability-button" @click="${() => state.clicks++}">
      Click me
    </button>
  </section>`
})
