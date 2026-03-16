import { html } from '@arrow-js/core'
import { CalculatorApp } from './CalculatorApp'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`${CalculatorApp()}`(root)
