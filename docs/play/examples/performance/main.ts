import { html } from '@arrow-js/core'
import { PerformanceBoard } from './PerformanceBoard'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`${PerformanceBoard()}`(root)
