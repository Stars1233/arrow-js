import { component, html, reactive } from '@arrow-js/core'
import { FrameCard } from './FrameCard'
import { StableCounter } from './StableCounter'

export const StabilityLab = component(() => {
  const state = reactive({
    warm: true,
    showSecondary: true,
    version: 1,
  })

  return html`<main class="stability-shell">
    <section class="stability-header">
      <p class="stability-eyebrow">Component Stability</p>
      <h1>Parent rerenders should not reset local child state.</h1>
      <div class="stability-actions">
        <button class="stability-button" @click="${() => state.version++}">
          Refresh parent
        </button>
        <button class="stability-button stability-button--ghost" @click="${() => (state.warm = !state.warm)}">
          Toggle tone
        </button>
        <button class="stability-button stability-button--ghost" @click="${() => (state.showSecondary = !state.showSecondary)}">
          Toggle second slot
        </button>
      </div>
    </section>

    <section class="stability-grid">
      ${FrameCard({
        content: StableCounter({ label: 'Primary counter' }),
        subtitle: `Parent revision ${state.version}`,
        title: 'Stable slot',
        tone: state.warm ? 'warm' : 'cool',
      })}

      ${() =>
        state.showSecondary
          ? FrameCard({
              content: StableCounter({ label: 'Secondary counter' }),
              subtitle: 'Remove this card to force a remount',
              title: 'Reset on unmount',
              tone: 'slate',
            })
          : html`<article class="stability-placeholder">
              The second slot is empty now. Bring it back and that counter starts fresh.
            </article>`}
    </section>
  </main>`
})
