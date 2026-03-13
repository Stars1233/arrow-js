import { component, html, pick, reactive } from '@src/index'

let instanceId = 0
const nextId = (label) => `${label}-${++instanceId}`

const Leaf = component((input) => {
  const local = reactive({
    clicks: 0,
    id: nextId('leaf'),
  })

  return html`<section class="stability-card">
    <h3>Leaf Component</h3>
    <div class="stability-controls">
      <button @click="${() => local.clicks++}">Mutate Leaf Local State</button>
    </div>
    <div class="stability-meta">
      <div>instance: ${() => local.id}</div>
      <div>local clicks: ${() => local.clicks}</div>
      <div>root count prop: ${() => input.count}</div>
      <div>parent tick prop: ${() => input.parentTick}</div>
      <div>grand tick prop: ${() => input.grandTick}</div>
    </div>
  </section>`
})

const Parent = component((input) => {
  const local = reactive({
    id: nextId('parent'),
    ticks: 0,
    wrapped: true,
  })

  return html`<section class="stability-card">
    <h2>Parent Component</h2>
    <div class="stability-controls">
      <button @click="${() => local.ticks++}">Rerender Parent</button>
      <button @click="${() => (local.wrapped = !local.wrapped)}">
        Toggle Parent Shape
      </button>
    </div>
    <div class="stability-meta">
      <div>instance: ${() => local.id}</div>
      <div>parent local ticks: ${() => local.ticks}</div>
      <div>grand tick prop: ${() => input.grandTick}</div>
      <div>root count prop: ${() => input.count}</div>
    </div>
    <div class="stability-note">
      ${() =>
        local.wrapped
          ? [
              html`<span class="stability-badge">parent shape: wrapped</span>`,
              Leaf(
                pick(
                  reactive({
                    count: input.count,
                    grandTick: input.grandTick,
                    parentTick: local.ticks,
                  }),
                  'count',
                  'grandTick',
                  'parentTick'
                )
              ).key('leaf'),
            ]
          : [
              html`<span class="stability-badge">parent shape: bare</span>`,
              Leaf(
                pick(
                  reactive({
                    count: input.count,
                    grandTick: input.grandTick,
                    parentTick: local.ticks,
                  }),
                  'count',
                  'grandTick',
                  'parentTick'
                )
              ).key('leaf'),
            ]}
    </div>
  </section>`
})

const Grandparent = component((input) => {
  const local = reactive({
    id: nextId('grand'),
    ticks: 0,
    framed: true,
  })

  return html`<section class="stability-grid">
    <section class="stability-card">
      <h2>Grandparent Component</h2>
      <div class="stability-controls">
        <button @click="${() => local.ticks++}">Rerender Grandparent</button>
        <button @click="${() => (local.framed = !local.framed)}">
          Toggle Grandparent Shape
        </button>
      </div>
      <div class="stability-meta">
        <div>instance: ${() => local.id}</div>
        <div>grand local ticks: ${() => local.ticks}</div>
        <div>root count prop: ${() => input.count}</div>
      </div>
    </section>
    ${() =>
      local.framed
        ? [
            html`<div class="stability-badge">grand shape: framed</div>`,
            Parent(
              pick(
                reactive({
                  count: input.count,
                  grandTick: local.ticks,
                }),
                'count',
                'grandTick'
              )
            ).key('parent'),
          ]
        : [Parent(pick(reactive({
            count: input.count,
            grandTick: local.ticks,
          }), 'count', 'grandTick')).key('parent')]}
  </section>`
})

const state = reactive({
  count: 1,
  shellTick: 0,
  showTree: true,
  badge: true,
})

html`<section class="stability-grid">
  <section class="stability-card">
    <h2>Root Template</h2>
    <div class="stability-controls">
      <button @click="${() => state.count++}">Increment Root Count</button>
      <button @click="${() => state.shellTick++}">Rerender Root Template</button>
      <button @click="${() => (state.badge = !state.badge)}">
        Toggle Root Shape
      </button>
      <button @click="${() => (state.showTree = !state.showTree)}">
        Mount / Unmount Tree
      </button>
    </div>
    <div class="stability-meta">
      <div>root count: ${() => state.count}</div>
      <div>root shell tick: ${() => state.shellTick}</div>
      <div>tree mounted: ${() => String(state.showTree)}</div>
    </div>
  </section>
  ${() =>
    state.showTree
      ? [
          state.badge
            ? html`<div class="stability-badge">root shape: with badge</div>`
            : '',
          Grandparent(pick(state, 'count')).key('grand'),
          html`<div class="stability-note">
            Click the leaf button, then rerender the parent, grandparent, and
            root. The leaf instance id and local clicks should survive. Toggle
            mount/unmount to see identity reset only when the slot disappears.
          </div>`,
        ]
      : html`<div class="stability-note">
          Tree unmounted. Mount it again and the instance ids will be new.
        </div>`}
</section>`(document.getElementById('demo-root'))
