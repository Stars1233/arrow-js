import { component, html } from '@arrow-js/core'

type KeypadProps = {
  onClear: () => void
  onDecimal: () => void
  onDigit: (digit: string) => void
  onEquals: () => void
  onOperator: (operator: string) => void
  onPercent: () => void
  onToggleSign: () => void
}

const rows = [
  [
    { label: 'C', tone: 'muted', press: (props: KeypadProps) => props.onClear() },
    { label: '+/-', tone: 'muted', press: (props: KeypadProps) => props.onToggleSign() },
    { label: '%', tone: 'muted', press: (props: KeypadProps) => props.onPercent() },
    { label: '÷', tone: 'accent', press: (props: KeypadProps) => props.onOperator('/') },
  ],
  [
    { label: '7', press: (props: KeypadProps) => props.onDigit('7') },
    { label: '8', press: (props: KeypadProps) => props.onDigit('8') },
    { label: '9', press: (props: KeypadProps) => props.onDigit('9') },
    { label: 'x', tone: 'accent', press: (props: KeypadProps) => props.onOperator('x') },
  ],
  [
    { label: '4', press: (props: KeypadProps) => props.onDigit('4') },
    { label: '5', press: (props: KeypadProps) => props.onDigit('5') },
    { label: '6', press: (props: KeypadProps) => props.onDigit('6') },
    { label: '-', tone: 'accent', press: (props: KeypadProps) => props.onOperator('-') },
  ],
  [
    { label: '1', press: (props: KeypadProps) => props.onDigit('1') },
    { label: '2', press: (props: KeypadProps) => props.onDigit('2') },
    { label: '3', press: (props: KeypadProps) => props.onDigit('3') },
    { label: '+', tone: 'accent', press: (props: KeypadProps) => props.onOperator('+') },
  ],
  [
    { label: '0', tone: 'wide', press: (props: KeypadProps) => props.onDigit('0') },
    { label: '.', press: (props: KeypadProps) => props.onDecimal() },
    { label: '=', tone: 'accent', press: (props: KeypadProps) => props.onEquals() },
  ],
]

export const Keypad = component((props: KeypadProps) =>
  html`<section class="calculator-keypad">
    ${rows.map(
      (row) => html`<div class="calculator-keypad__row">
        ${row.map(
          (button) => html`<button
            class="${`calculator-key calculator-key--${button.tone ?? 'default'}`}"
            @click="${() => button.press(props)}"
          >
            ${button.label}
          </button>`
        )}
      </div>`
    )}
  </section>`
)
