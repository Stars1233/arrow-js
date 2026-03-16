import { component, html } from '@arrow-js/core'

export const FrameCard = component((props: {
  content: unknown
  subtitle: string
  title: string
  tone: string
}) =>
  html`<article class="${() => `frame-card frame-card--${props.tone}`}">
    <p class="frame-card__subtitle">${() => props.subtitle}</p>
    <h2>${() => props.title}</h2>
    ${() => props.content}
  </article>`
)
