import { component, html, reactive } from '@src/index'

const parentState = reactive({
  count: 1,
})

const Counter = component((props) => {
  const local = reactive({
    clicks: 0,
  })

  return html`<button @click="${() => local.clicks++}">
    Root count ${() => props.count} | Local clicks ${() => local.clicks}
  </button>`
})

export const intro = {
  code: `import { component, html, reactive } from '@arrow-js/core'

const parentState = reactive({
  count: 1
})

const Counter = component((props) => {
  const local = reactive({
    clicks: 0
  })

  return html\`<button @click="\${() => local.clicks++}">
    Root count \${() => props.count} | Local clicks \${() => local.clicks}
  </button>\`
})

html\`\${Counter(parentState)}\``,
  example: Counter(parentState),
}

export const narrowed = {
  code: `import { component, html, pick, reactive } from '@arrow-js/core'

const state = reactive({
  count: 1,
  theme: 'dark'
})

const Counter = component((props) =>
  html\`<strong>\${() => props.count}</strong>\`
)

html\`\${Counter(pick(state, 'count'))}\``,
}
