import { html } from '@src/index'
import example from './Example'
import FrameworkExamples from '../examples/FrameworkExamples'

export default function () {
  return html`
    <h2 id="ssr">Server Rendering</h2>
    <section>
      <p><code>render(root, view)</code> and <code>renderToString(view)</code></p>
      <ul>
        <li><code>@arrow-js/core</code> stays DOM-first and framework-agnostic.</li>
        <li><code>@arrow-js/framework</code> adds async render tracking and boundaries.</li>
        <li><code>@arrow-js/ssr</code> renders HTML and payload data.</li>
        <li><code>@arrow-js/hydrate</code> resumes the same view in the browser.</li>
      </ul>
      <p>During SSR, <code>renderToString()</code> waits for nested async components and dependent async work before it returns HTML.</p>
      <p><code>idPrefix</code> is optional. Use it when you want readable ids for serialized async snapshots or boundary markers.</p>
      ${example(FrameworkExamples.asyncComponent, null, 'typescript')}
      <aside class="tip">
        Think of <code>idPrefix</code> as a naming hint, not a manual id
        system. Arrow still appends its own counters so multiple instances stay
        distinct.
      </aside>
    </section>

    <h2 id="hydration">Hydration</h2>
    <section>
      <p><code>hydrate(root, view, payload)</code></p>
      <ul>
        <li>The server emits HTML plus a small JSON payload.</li>
        <li>The client stages the same view, adopts matching DOM, and reconnects reactivity.</li>
        <li>JSON-safe async results resume from serialized payload data, so matching components do not refetch.</li>
        <li>If a subtree does not match, Arrow repairs marked boundaries before falling back further up.</li>
      </ul>
      <p>Boundary <code>idPrefix</code> values appear in the DOM and payload so the hydrator can adopt or repair a bounded region instead of replacing the whole root.</p>
      ${example(FrameworkExamples.client, null, 'typescript')}
    </section>

    <h2 id="ecosystem">Ecosystem Packages</h2>
    <section>
      <p>The current split is intentionally simple:</p>
      <ul>
        <li>
          <code>@arrow-js/core</code> exposes <code>reactive</code>,
          <code>watch</code>, <code>html</code>, and the low-level stable
          <code>component</code> primitive.
        </li>
        <li>
          <code>@arrow-js/framework</code> installs the async runtime behind
          core <code>component()</code>, and adds <code>boundary()</code> and
          <code>render()</code>.
        </li>
        <li>
          <code>@arrow-js/ssr</code> exposes <code>renderToString()</code> and
          <code>serializePayload()</code>.
        </li>
        <li>
          <code>@arrow-js/hydrate</code> exposes <code>hydrate()</code> and
          <code>readPayload()</code>.
        </li>
      </ul>
      <aside class="tip">
        If the default async behavior works for your case, keep the component
        declaration simple. The option bag is for custom fallbacks, custom
        serialization, or easier-to-read SSR ids, not for the common case.
      </aside>
    </section>
  `
}
