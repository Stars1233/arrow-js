import { component, html, reactive } from '@arrow-js/core'
import { Carousel } from './Carousel'
import { slides } from './slides'

export const GalleryApp = component(() => {
  const state = reactive({
    currentIndex: 0,
    showDetails: true,
  })

  const move = (delta: number) => {
    state.currentIndex =
      (state.currentIndex + delta + slides.length) % slides.length
  }

  return html`<main class="gallery-shell">
    <section class="gallery-header">
      <div>
        <p class="gallery-eyebrow">Carousel</p>
        <h1>A component for the stage and another for the rail.</h1>
      </div>
      <button class="carousel-button carousel-button--light" @click="${() => (state.showDetails = !state.showDetails)}">
        ${() => (state.showDetails ? 'Hide details' : 'Show details')}
      </button>
    </section>

    ${Carousel({
      currentIndex: state.currentIndex,
      onMove: move,
      onSelect(index: number) {
        state.currentIndex = index
      },
      slides,
    })}

    ${() =>
      state.showDetails
        ? html`<aside class="gallery-notes">
            <h3>Current slide notes</h3>
            <p>${() => slides[state.currentIndex].description}</p>
          </aside>`
        : ''}
  </main>`
})
