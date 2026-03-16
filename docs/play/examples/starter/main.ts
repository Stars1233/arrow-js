import { html } from '@arrow-js/core'
import { App } from './App'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`<div class="starter-page">${App()}</div>`(root)
