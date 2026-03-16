import { html } from '@src/index'
import example from './Example'
import collapsable from './Collapsable'
import * as TemplateExamples from '../examples/TemplateExamples'

export default function () {
  return html`
    <h2 id="templates">Templates <code>t</code></h2>
    <section>
      <p><code>html\`...\`</code> - create a mountable template</p>
      <ul>
        <li>Templates can be mounted directly, passed around, or returned from components.</li>
        <li>Arrow is static by default. Expressions only stay live when they are functions.</li>
        <li>Templates can render text, attributes, properties, lists, nested templates, and events.</li>
      </ul>
      ${example(TemplateExamples.intro.code, TemplateExamples.intro.example, 'typescript')}
      <p>Static expressions render once. Function expressions stay live.</p>
      ${example(
        TemplateExamples.expressions.code,
        TemplateExamples.expressions.example,
        'typescript'
      )}
      ${collapsable(html`
        <p>
          In practice, most page content is static after first render. Arrow
          keeps that path cheap and lets you opt into reactivity only for the
          parts that truly change.
        </p>
      `)}
      <p>Reactive expressions can appear in text content, element content, attributes, and properties.</p>
      <p>They cannot switch an element tag name. Use nested templates instead.</p>
      ${example(TemplateExamples.invalid, null, 'typescript').error(
        'Don’t use reactive expressions as <code>Element</code> types. Instead use nested templates.'
      )}
      <h3>Attributes</h3>
      <p>Use a function expression to keep an attribute in sync.</p>
      ${example(
        TemplateExamples.attributes.code,
        TemplateExamples.attributes.example,
        'typescript'
      )}
      <aside class="tip">
        Returning <code>false</code> from an attribute expression will remove
        the attribute. This makes it easy to toggle attributes.
      </aside>
      <h3>Properties</h3>
      <p>Prefix an attribute with <code>.</code> to write an IDL property.</p>
      ${example(TemplateExamples.idl.code, TemplateExamples.idl.example, 'typescript')}
      <h3>Lists</h3>
      <p>Return an array of templates to render a list. Add <code>.key(...)</code> when identity must survive reorders.</p>
      ${example(TemplateExamples.list.code, TemplateExamples.list.example, 'typescript')}
      <aside class="tip">
        Keys are only necessary if you want to preserve the DOM nodes and their
        state. Avoid using the index as a key.
      </aside>
      <h3>Events</h3>
      <p><code>@eventName</code> attaches an event listener.</p>
      ${example(TemplateExamples.events.code, null, 'typescript')}
    </section>
  `
}
