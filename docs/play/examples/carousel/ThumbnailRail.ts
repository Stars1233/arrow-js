import { component, html } from '@arrow-js/core'

export const ThumbnailRail = component((props: {
  currentIndex: number
  onSelect: (index: number) => void
  slides: Array<{ title: string; location: string; accent: string }>
}) =>
  html`<div class="thumb-rail">
    ${props.slides.map(
      (slide, index) => html`<button
        class="thumb-rail__button"
        data-active="${() => String(index === props.currentIndex)}"
        style="${`--thumb-accent:${slide.accent}`}"
        @click="${() => props.onSelect(index)}"
      >
        <span>${slide.title}</span>
        <small>${slide.location}</small>
      </button>`
    )}
  </div>`
)
