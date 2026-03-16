import { component, html } from '@arrow-js/core'

export const TabButton = component((props: {
  current: string
  id: string
  label: string
  onSelect: (id: string) => void
}) =>
  html`<button
    class="tab-button"
    data-active="${() => String(props.current === props.id)}"
    @click="${() => props.onSelect(props.id)}"
  >
    ${() => props.label}
  </button>`
)
