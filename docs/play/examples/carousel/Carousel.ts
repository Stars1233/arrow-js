import { component, html } from '@arrow-js/core'
import { ThumbnailRail } from './ThumbnailRail'

export const Carousel = component((props: {
  currentIndex: number
  onMove: (delta: number) => void
  onSelect: (index: number) => void
  slides: Array<{
    title: string
    location: string
    accent: string
    description: string
  }>
}) =>
  html`<section class="carousel-card">
    <article
      class="carousel-stage"
      style="${() => `--slide-accent:${props.slides[props.currentIndex].accent}`}"
    >
      <div class="carousel-stage__copy">
        <p class="carousel-stage__location">
          ${() => props.slides[props.currentIndex].location}
        </p>
        <h2>${() => props.slides[props.currentIndex].title}</h2>
        <p>${() => props.slides[props.currentIndex].description}</p>
      </div>
      <div class="carousel-stage__actions">
        <button class="carousel-button" @click="${() => props.onMove(-1)}">
          Previous
        </button>
        <button class="carousel-button" @click="${() => props.onMove(1)}">
          Next
        </button>
      </div>
    </article>

    ${ThumbnailRail({
      currentIndex: props.currentIndex,
      onSelect: props.onSelect,
      slides: props.slides,
    })}
  </section>`
)
