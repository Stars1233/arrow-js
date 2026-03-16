import { component, html } from '@arrow-js/core'

export const FieldCard = component((props: {
  content: unknown
  description: string
  title: string
}) =>
  html`<article class="field-card">
    <h2>${() => props.title}</h2>
    <p>${() => props.description}</p>
    ${() => props.content}
  </article>`
)
