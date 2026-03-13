import { html } from '@src/index'
import example from './Example'
import * as ComponentExamples from '../examples/ComponentExamples'

export default function () {
  return html`
    <h2 id="components">Components <code>c</code> || <code>component</code></h2>
    <section>
      <p>
        Arrow components are plain functions wrapped with
        <code>component()</code> (<code>c</code> for shorthand). A component is
        mounted once per render slot and keeps its local state while that slot
        survives parent rerenders.
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
      ${example(ComponentExamples.intro.code, ComponentExamples.intro.example)}
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
      ${example(ComponentExamples.narrowed.code)}
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
    </section>
  `
}
