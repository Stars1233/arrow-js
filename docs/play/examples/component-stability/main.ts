import { html } from '@arrow-js/core'
import { StabilityLab } from './StabilityLab'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`${StabilityLab()}`(root)
