import { html } from '@arrow-js/core'
import { DropdownGallery } from './DropdownGallery'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

html`${DropdownGallery()}`(root)
