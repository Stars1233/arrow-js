import { hydrate, readPayload } from '@arrow-js/hydrate'
import { createPage } from './page'
import './style.css'

const payload = readPayload()
const page = createPage(window.location.pathname)
const root = document.getElementById(payload.rootId ?? 'app')

if (!root) {
  throw new Error(`Unable to find hydration root "${payload.rootId ?? 'app'}".`)
}

await hydrate(root, page.view, payload, {
  onMismatch(details) {
    if (!details.repaired || details.boundaryFallbacks > 0) {
      console.warn(
        'Arrow hydration mismatch detected, falling back to client render.',
        details
      )
    }
  },
})
