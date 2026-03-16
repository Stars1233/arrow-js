import { html } from '@src/index'
import example from './Example'
import reactiveData from './ReactiveData'
import watchingData from './WatchingData'
import components from './Components'
import templates from './Templates'
import serverRendering from './ServerRendering'
import FrameworkExamples from '../examples/FrameworkExamples'
import examples from './Examples'

export default function () {
  return html`
    <h1 id="essentials">Essentials</h1>

    <h2 id="what-is-arrow">What is Arrow</h2>
    <section>
      <p>
        Arrow is a small reactive UI runtime built around platform primitives:
        JavaScript modules, template literals, and the DOM.
      </p>
      <ul>
        <li>Keep the core runtime small and direct.</li>
        <li>Use platform primitives like modules, template literals, and the DOM.</li>
        <li>Make client-only rendering trivial.</li>
        <li>Layer SSR, hydration, and async components in separate packages.</li>
      </ul>
      <p>
        That split is the main idea behind the current monorepo. Reach for
        <code>@arrow-js/core</code> when you just need reactive DOM work. Reach
        for the framework packages when you want SSR, hydration, and async
        component orchestration.
      </p>
    </section>

    <h2 id="quick-start">Quickstart</h2>
    <section>
      <p>
        The fastest way into a full Arrow app right now is the Arrow Vite 8
        scaffold.
      </p>
      <strong>Install:</strong>
      ${example(FrameworkExamples.install, null, 'shell')}
      <p>
        The scaffold already includes <code>server.mjs</code>,
        <code>vite.config.ts</code>, <code>src/entry-server.ts</code>, and
        <code>src/entry-client.ts</code>. Open <code>src/App.ts</code> and
        start editing.
      </p>
      <strong><code>src/App.ts</code></strong>
      ${example(FrameworkExamples.app, null, 'typescript')}
      <p>
        The exact <code>pnpm create vite@latest ... --template arrow-js</code>
        flow still depends on Vite shipping an Arrow template upstream. Today,
        the scaffold lives in <code>create-arrow-js</code>.
      </p>
      <p>
        Arrow also ships TypeScript definitions. If you are using TypeScript,
        component props, computed values, and the SSR helpers surface directly
        in your editor.
      </p>
    </section>

    ${components()}

    <h1 id="api">API</h1>
    <section>
      <p>Arrow’s public surface is small. Use this section as reference.</p>
      <ul>
        <li><code>reactive()</code> creates state or computed values.</li>
        <li><code>watch()</code> runs effects from tracked reads.</li>
        <li><code>html</code> returns mountable templates.</li>
        <li>
          The SSR packages add <code>render()</code>,
          <code>renderToString()</code>, <code>hydrate()</code>, and boundary
          helpers without growing the core runtime.
        </li>
      </ul>
    </section>

    ${reactiveData} ${watchingData} ${templates} ${serverRendering()}
    ${examples}
  `
}
