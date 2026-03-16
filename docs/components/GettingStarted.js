import { html } from '@src/index'
import example from './Example'
import reactiveData from './ReactiveData'
import watchingData from './WatchingData'
import components from './Components'
import templates from './Templates'
import serverRendering from './ServerRendering'
import InstallationExamples from '../examples/InstallationExamples'
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
        The fastest way into a full Arrow app right now is a Vite 8 project
        with the SSR and hydration packages installed next to core.
      </p>
      <p>
        These examples use TypeScript and the Vite
        <code>vanilla-ts</code> starter. Arrow’s packages ship type
        information, so you can keep the same native-JavaScript model while
        still getting checked props and editor help.
      </p>
      <strong>Install:</strong>
      ${example(FrameworkExamples.install, null, 'shell')}
      <strong><code>src/App.ts</code></strong>
      ${example(FrameworkExamples.app, null, 'typescript')}
      <strong><code>src/entry-server.ts</code></strong>
      ${example(FrameworkExamples.server, null, 'typescript')}
      <p>
        On the client, read the serialized payload and hydrate the same view:
      </p>
      <strong><code>src/entry-client.ts</code></strong>
      ${example(FrameworkExamples.client, null, 'typescript')}
      <p>
        This is the shape used by the docs app itself. The server sends HTML
        immediately, then the browser hydrates the existing DOM instead of
        replacing it.
      </p>
      <h3>Other Ways to Install Arrow</h3>
      <p>
        Arrow still works fine without a build tool. If you only need the core
        runtime, a simple module import is enough.
      </p>
      <strong>From npm:</strong>
      ${example(InstallationExamples.npm, null, 'shell')}
      <strong>From Yarn:</strong>
      ${example(InstallationExamples.yarn, null, 'shell')}
      <h3>From a CDN</h3>
      <p>
        You can install Arrow directly from a CDN. We recommend using
        <a href="https://esm.sh/">esm.sh</a> since it serves ESM cleanly.
      </p>
      ${example(InstallationExamples.cdn, null, 'html')}
      <h3>On your local filesystem</h3>
      ${example(InstallationExamples.local, null, 'html')}
      <h3>Editor support</h3>
      <p>
        Since Arrow uses tagged template literals its syntax is very similar to
        lit-html. Editors that support lit-html will also support Arrow. If you
        are using VSCode you can install the
        <a
          href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html"
          >lit-html</a
        >
        extension to enable syntax highlighting on <code>html</code> blocks.
      </p>
      <p>
        Arrow also ships TypeScript definitions. If you are using TypeScript,
        component props, computed values, and the SSR helpers will all surface
        their types directly in your editor.
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
