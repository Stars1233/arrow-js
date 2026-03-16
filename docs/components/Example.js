import { html, reactive } from '@src/index'
import stopUrl from '../img/stop.svg'
import warningUrl from '../img/warning.svg'

function renderExample(component) {
  if (!component) {
    return ''
  }

  return typeof component === 'string' ? html([component]) : component
}

export default function (example, component, language = 'javascript') {
  const data = reactive({
    warning: false,
    error: false,
  })
  const template = html` <div class="stage">
    ${() =>
      data.warning &&
      html`<div class="warning">
        <img
          src="${warningUrl}"
          alt="warning"
          role="presentation"
        />${data.warning}
      </div>`}
    ${() =>
      data.error &&
      html`<div class="error">
        <img src="${stopUrl}" alt="stop" role="presentation" />${data.error}
      </div>`}
    <pre><code class="${`language-${language}`}">${String(example)}</code></pre>
    ${() =>
      !!component && html`<div class="example">${renderExample(component)}</div>`}
  </div>`

  template.warning = (message) => {
    data.warning = message
    return template
  }

  template.error = (message) => {
    data.error = message
    return template
  }

  return template
}
