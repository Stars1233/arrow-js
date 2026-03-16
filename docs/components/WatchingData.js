import { html } from '@src/index'
import example from './Example'
import ReactiveDataExamples from '../examples/ReactiveDataExamples'

export default function () {
  return html` <h2 id="watching-data">
      Watching data <code>w</code> || <code>watch</code>
    </h2>
    <section>
      <p><code>watch(effect)</code> or <code>watch(getter, afterEffect)</code></p>
      <ul>
        <li>Use it for derived side effects outside templates.</li>
        <li>Dependencies are discovered automatically from reactive reads.</li>
        <li>Arrow also drops dependencies that are no longer touched on later runs.</li>
      </ul>
      <p>Single-effect form:</p>
      ${example(
        ReactiveDataExamples.watcher.code,
        ReactiveDataExamples.watcher.example,
        'typescript'
      )}
      <p>Getter plus effect form:</p>
      ${example(
        ReactiveDataExamples.watcher2.code,
        ReactiveDataExamples.watcher2.example,
        'typescript'
      )}
    </section>`
}
