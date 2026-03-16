import { html } from '@src/index'
import example from './Example'
import ReactiveDataExamples from '../examples/ReactiveDataExamples'

export default function () {
  return html`
    <h2 id="reactive-data">
      Reactive Data <code>r</code> || <code>reactive</code>
    </h2>
    <section>
      <p><code>reactive(value)</code> or <code>reactive(() =&gt; value)</code></p>
      <ul>
        <li>Wrap objects or arrays to create observable state.</li>
        <li>Pass an expression to create a computed value.</li>
        <li>Use it for local component state, shared stores, and mutable props.</li>
        <li>Read properties normally. Arrow tracks those reads inside watchers and template expressions.</li>
        <li>Use <code>$on</code> and <code>$off</code> when you want manual subscriptions.</li>
      </ul>
      ${example(ReactiveDataExamples.intro.code, ReactiveDataExamples.intro.example, 'typescript')}
      <p><code>$on(property, callback)</code> and <code>$off(property, callback)</code></p>
      ${example(ReactiveDataExamples.on.code, ReactiveDataExamples.on.example, 'typescript')}
      <p>Most app code should move up to <code>watch()</code> or template expressions instead of manual subscriptions.</p>
      ${example(
        ReactiveDataExamples.calculator.code,
        ReactiveDataExamples.calculator.example,
        'typescript'
      ).warning(
        'Read on to learn how to do this elegantly with <a href="#watching-data">watchers</a>!'
      )}
      <h3>Computed values</h3>
      <p><code>reactive(() =&gt; value)</code> reruns when its tracked reads change.</p>
      ${example(
        ReactiveDataExamples.computed.code,
        ReactiveDataExamples.computed.example,
        'typescript'
      )}
      <aside class="tip">
        <code>data.total</code> reads like a normal value even though it is
        backed by a tracked expression.
      </aside>
    </section>
  `
}
