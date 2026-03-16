import { component, html, reactive } from '@arrow-js/core'

export const FeedStats = component((props: {
  model: { running: boolean; updates: number; items: Array<unknown> }
}) => {
  const derived = reactive({
    throughput: reactive(() => props.model.updates * props.model.items.length),
  })

  return html`<section class="performance-stats">
    <article>
      <span>Status</span>
      <strong>${() => (props.model.running ? 'Live' : 'Paused')}</strong>
    </article>
    <article>
      <span>Batches</span>
      <strong>${() => props.model.updates}</strong>
    </article>
    <article>
      <span>Cell writes</span>
      <strong>${() => derived.throughput}</strong>
    </article>
  </section>`
})
