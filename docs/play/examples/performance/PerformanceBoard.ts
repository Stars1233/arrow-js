import { component, html, reactive } from '@arrow-js/core'
import { FeedStats } from './FeedStats'
import { TickerRow } from './TickerRow'

const token = () => Math.random().toString(36).slice(2, 6).toUpperCase()
type FeedItem = {
  id: number
  label: string
  value: string
  pulse: number
}

export const PerformanceBoard = component(() => {
  const items: FeedItem[] = Array.from({ length: 36 }, (_, index) => ({
    id: index + 1,
    label: `Feed ${String(index + 1).padStart(2, '0')}`,
    value: token(),
    pulse: 0,
  }))
  const state = reactive<{
    updates: number
    running: boolean
    items: FeedItem[]
  }>({
    updates: 0,
    running: false,
    items,
  })

  let timer = 0

  const tick = () => {
    if (!state.running) {
      return
    }

    for (let index = 0; index < state.items.length; index += 1) {
      const item = state.items[index] as FeedItem

      if (index % 3 === state.updates % 3) {
        item.value = token()
        item.pulse = (item.pulse + 1) % 3
      }
    }

    state.updates += 1
    timer = window.setTimeout(tick, 45)
  }

  const start = () => {
    if (state.running) {
      return
    }

    state.running = true
    tick()
  }

  const stop = () => {
    state.running = false
    window.clearTimeout(timer)
  }

  return html`<main class="performance-shell">
    <section class="performance-card">
      <header class="performance-header">
        <div>
          <p class="performance-eyebrow">Performance</p>
          <h1>One board, many stable rows.</h1>
        </div>
        <div class="performance-actions">
          <button class="performance-button" @click="${start}">Start</button>
          <button class="performance-button performance-button--ghost" @click="${stop}">
            Pause
          </button>
        </div>
      </header>

      ${FeedStats({ model: state })}

      <section class="performance-grid">
        ${() =>
          state.items.map((item) => {
            const feedItem = item as FeedItem
            return TickerRow({ item: feedItem }).key(feedItem.id)
          })}
      </section>
    </section>
  </main>`
})
