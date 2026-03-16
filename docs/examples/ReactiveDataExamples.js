import { html, reactive } from '@src/index'

export default {
  intro: {
    code: `import { reactive } from '@arrow-js/core'

const data = reactive({
  price: 25,
  quantity: 10
})

console.log(data.price);`,
    example: () => {
      const data = reactive({
        price: 25,
        quantity: 10,
      })
      return html`<code class="console">// outputs ${data.price}</code>`
    },
  },

  on: {
    code: `import { reactive } from '@arrow-js/core'

const data = reactive({
  price: 25,
  quantity: 10
})

data.$on('price', (value) => {
  console.log(\`Price changed to \${value}\`)
})

data.price = 35
`,
    example: '<code class="console">// outputs \'Price changed to 35\' </code>',
  },
  computed: {
    code: `import { reactive } from '@arrow-js/core'

const props = reactive({
  count: 2,
  multiplier: 10
})

const data = reactive({
  total: reactive(() => props.count * props.multiplier)
})

console.log(data.total) // 20
props.count = 3
console.log(data.total) // 30
`,
    example: () => {
      const props = reactive({
        count: 2,
        multiplier: 10,
      })
      const data = reactive({
        total: reactive(() => props.count * props.multiplier),
      })

      return html`<button @click="${() => props.count++}">
        Total ${() => data.total}
      </button>`
    },
  },
  calculator: {
    code: `import { reactive } from '@arrow-js/core'

const data = reactive({
  price: 25,
  quantity: 10,
  logTotal: true
})

function total () {
  if (data.logTotal) {
    console.log(\`Total: \${data.price * data.quantity}\`);
  }
}

data.$on('price', total)
data.$on('quantity', total)
data.$on('logTotal', total)
total()
data.price = 35

data.$off('quantity', total)
data.quantity = 20
`,
    example:
      "<code class=\"console\">// outputs:<br>'Total: 250'<br>'Total: 350'<br>// Note: We stopped observing 'quantity' with $off<br>// so changing data.quantity will not log anything</code>",
  },
  watcher: {
    code: `import { reactive, watch } from '@arrow-js/core'

const data = reactive({
  price: 25,
  quantity: 10,
  logTotal: true
})

function total () {
  if (data.logTotal) {
    console.log(\`Total: \${data.price * data.quantity}\`);
  }
}

watch(total)

data.price = 35`,
    example:
      "<code class=\"console\">// outputs:<br>'Total: 250'<br>'Total: 350'</code>",
  },
  watcher2: {
    code: `import { reactive, watch } from '@arrow-js/core'

const data = reactive({
  price: 25,
  quantity: 10,
  logTotal: true
})

watch(
  () => data.logTotal ? data.price * data.quantity : null,
  (total) => total !== null && console.log(\`Total: \${total}\`)
)

data.price = 35`,
    example:
      "<code class=\"console\">// outputs:<br>'Total: 250'<br>'Total: 350'</code>",
  },
}
