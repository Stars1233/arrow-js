import { component, html } from '@arrow-js/core'

export const TickerRow = component((props: {
  item: { label: string; value: string; pulse: number }
}) =>
  html`<article
    class="${() => `performance-row performance-row--pulse-${props.item.pulse}`}"
  >
    <span class="performance-row__label">${() => props.item.label}</span>
    <strong class="performance-row__value">${() => props.item.value}</strong>
  </article>`
)
