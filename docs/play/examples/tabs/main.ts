import { html } from '@arrow-js/core'
import { TabsDemo } from './TabsDemo'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`${TabsDemo()}`(root)
