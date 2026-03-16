import { component, html } from '@arrow-js/core'

export const CalculatorDisplay = component((props: {
  model: { display: string; stored: number | null; operator: string | null }
}) =>
  html`<section class="calculator-display">
    <p class="calculator-display__memory">
      ${() =>
        props.model.operator && props.model.stored !== null
          ? `${props.model.stored} ${props.model.operator}`
          : 'Ready'}
    </p>
    <strong class="calculator-display__value">${() => props.model.display}</strong>
  </section>`
)
