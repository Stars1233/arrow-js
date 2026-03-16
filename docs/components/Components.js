import { html } from '@src/index'
import example from './Example'
import * as ComponentExamples from '../examples/ComponentExamples'

export default function () {
  return html`
    <h2 id="components">Components</h2>
    <section>
      <p>
        Arrow components are plain functions wrapped with
        <code>component()</code>. A component mounts once per render slot and
        keeps local state while that slot survives parent rerenders.
      </p>
      <p>
        This gives Arrow a small but useful component model:
      </p>
      <ul>
        <li>Pass a reactive object as props.</li>
        <li>Read props lazily inside expressions like <code>() =&gt; props.count</code>.</li>
        <li>Keep local component state with <code>reactive()</code> inside the component.</li>
        <li>Use <code>.key(...)</code> when rendering components in keyed lists.</li>
      </ul>
      ${example(ComponentExamples.intro.code, ComponentExamples.intro.example, 'typescript')}
      <p>
        The important detail is that the component function itself is not rerun
        on every parent update. Arrow keeps the instance for that slot and
        retargets its props when needed. That makes local state stable across
        higher-order rerenders.
      </p>
      <p>
        If you only want part of a larger reactive object, use
        <code>pick(source, ...keys)</code> to create a live narrowed prop view
        without writing a call-site closure.
      </p>
      ${example(ComponentExamples.narrowed.code, null, 'typescript')}
      <aside class="tip">
        Props stay live when you read them lazily. Avoid destructuring them once
        at component creation time if you expect updates.
      </aside>
      <p>
        Slot identity is the default. If a component is rerendered in the same
        position, its local state survives. If that slot is removed entirely,
        the component is unmounted and a future mount creates a fresh instance.
      </p>
      <p>
        For a live example with nested rerenders and shape changes, see the
        <a href="/demos/component-stability.html">component stability demo</a>.
      </p>
      <h3>Async components</h3>
      <p>
        The same core <code>component()</code> also accepts async factories
        when the Arrow async runtime is present:
      </p>
      ${example(`import { component, html } from '@arrow-js/core'

type User = {
  id: string
  name: string
}

const UserName = component(async ({ id }: { id: string }) => {
  const user = await fetch(\`/api/users/\${id}\`).then(
    (r) => r.json() as Promise<User>
  )

  return user.name
})

const UserCard = component((props: { id: string }) =>
  html\`<article>\${UserName(props)}</article>\`
)`, null, 'typescript')}
      <p>
        The important semantic split is simple: the async body resolves data,
        and the surrounding template stays reactive in the usual Arrow way. SSR
        waits for async components to settle, and hydration resumes JSON-safe
        results from serialized payload data automatically.
      </p>
      <aside class="tip">
        Most async components need no extra options. Arrow assigns ids,
        snapshots JSON-safe results, and renders resolved values directly by
        default. Reach for <code>fallback</code>, <code>render</code>,
        <code>serialize</code>, <code>deserialize</code>, or
        <code>idPrefix</code> only when the default behavior is not enough.
      </aside>
    </section>
  `
}
