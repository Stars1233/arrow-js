import { html } from '@src/index'
import { docsExampleMeta, playgroundExampleHref } from '../play/example-meta'

export default function () {
  return html`<section>
    <h1 id="examples">Examples</h1>
    <p>
      These examples now open directly in the playground, including the
      multi-file ones.
    </p>
    ${docsExampleMeta.map(
      (entry) => html`<section class="docs-example-card">
        <h3>${entry.title}</h3>
        <p>${entry.description}</p>
        <ul>
          <li>
            <a href="${playgroundExampleHref(entry.id)}">Open in Playground</a>
          </li>
          ${entry.sourceUrl
            ? html`<li><a href="${entry.sourceUrl}">Source code</a></li>`
            : ''}
        </ul>
      </section>`
    )}
  </section>`
}
