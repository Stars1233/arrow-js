import { component, html, reactive } from '@arrow-js/core'
import { CalculatorDisplay } from './CalculatorDisplay'
import { Keypad } from './Keypad'

function applyOperation(left: number, right: number, operator: string) {
  if (operator === '+') return left + right
  if (operator === '-') return left - right
  if (operator === 'x') return left * right
  return right === 0 ? 0 : left / right
}

export const CalculatorApp = component(() => {
  const state = reactive({
    display: '420',
    stored: null as null | number,
    operator: null as null | string,
    overwrite: true,
  })

  const readDisplay = () => Number(state.display)

  const commitDigit = (digit: string) => {
    if (state.overwrite) {
      state.display = digit
      state.overwrite = false
      return
    }

    state.display = state.display === '0' ? digit : `${state.display}${digit}`
  }

  const commitDecimal = () => {
    if (state.overwrite) {
      state.display = '0.'
      state.overwrite = false
      return
    }

    if (!state.display.includes('.')) {
      state.display = `${state.display}.`
    }
  }

  const chooseOperator = (operator: string) => {
    const current = readDisplay()

    if (state.operator && state.stored !== null && !state.overwrite) {
      state.stored = applyOperation(state.stored, current, state.operator)
      state.display = String(state.stored)
    } else {
      state.stored = current
    }

    state.operator = operator
    state.overwrite = true
  }

  const evaluate = () => {
    if (!state.operator || state.stored === null) {
      return
    }

    state.display = String(applyOperation(state.stored, readDisplay(), state.operator))
    state.stored = null
    state.operator = null
    state.overwrite = true
  }

  return html`<main class="calculator-shell">
    <section class="calculator-card">
      <header class="calculator-copy">
        <p class="calculator-eyebrow">Calculator</p>
        <h1>One reactive model, split into focused components.</h1>
        <p>
          The display stays dumb, the keypad is reusable, and the state machine
          lives in one place.
        </p>
      </header>

      <section class="calculator-surface">
        ${CalculatorDisplay({ model: state })}
        ${Keypad({
          onClear() {
            state.display = '0'
            state.stored = null
            state.operator = null
            state.overwrite = true
          },
          onDecimal: commitDecimal,
          onDigit: commitDigit,
          onEquals: evaluate,
          onOperator: chooseOperator,
          onPercent() {
            state.display = String(readDisplay() / 100)
            state.overwrite = true
          },
          onToggleSign() {
            state.display = String(readDisplay() * -1)
          },
        })}
      </section>
    </section>
  </main>`
})
