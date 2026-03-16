import { component, html, reactive } from '@arrow-js/core'

export const Dropdown = component((props: {
  label: string
  options: string[]
}) => {
  const state = reactive({
    open: false,
    query: '',
    selected: props.options[0] ?? '',
  })

  const matches = () =>
    props.options.filter((option) =>
      option.toLowerCase().includes(state.query.toLowerCase())
    )

  return html`<section class="dropdown">
    <button class="dropdown__trigger" @click="${() => (state.open = !state.open)}">
      <span>${() => props.label}</span>
      <strong>${() => state.selected}</strong>
    </button>

    ${() =>
      state.open
        ? html`<div class="dropdown__panel">
            <input
              class="dropdown__search"
              type="text"
              placeholder="Filter options"
              value="${() => state.query}"
              @input="${(event: Event) => {
                const input = event.target as HTMLInputElement | null
                state.query = input?.value ?? ''
              }}"
            />
            <ul class="dropdown__list">
              ${() =>
                matches().map(
                  (option) => html`<li>
                    <button
                      class="dropdown__item"
                      data-active="${() => String(option === state.selected)}"
                      @click="${() => {
                        state.selected = option
                        state.open = false
                      }}"
                    >
                      ${option}
                    </button>
                  </li>`
                )}
            </ul>
          </div>`
        : ''}
  </section>`
})
