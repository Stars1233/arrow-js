const SHIKI_URL = 'https://cdn.jsdelivr.net/npm/shiki@0.14.7/dist/index.unpkg.iife.js'
const SHIKI_CDN = 'https://cdn.jsdelivr.net/npm/shiki@0.14.7/'

let shikiLoader

function loadShiki() {
  if (globalThis.shiki) return Promise.resolve(globalThis.shiki)
  if (shikiLoader) return shikiLoader
  shikiLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SHIKI_URL
    script.onload = () => {
      if (globalThis.shiki) {
        globalThis.shiki.setCDN(SHIKI_CDN)
        resolve(globalThis.shiki)
      } else {
        reject(new Error('Shiki failed to initialize'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load Shiki'))
    document.head.append(script)
  })
  return shikiLoader
}

export default async function () {
  const langs = {
    javascript: 'js',
    js: 'js',
    html: 'html',
  }

  const shiki = await loadShiki()
  const highlighter = await shiki.getHighlighter({
    theme: 'css-variables',
    langs: ['js', 'html', 'shell'],
  })
  const codeBlocks = document.querySelectorAll('pre code[class*="language-"]')

  codeBlocks.forEach((block) => {
    const lang = block.className.replace('language-', '')
    const html = highlighter.codeToHtml(block.textContent || '', {
      lang: langs[lang] || lang,
    })
    block.parentElement?.replaceWith(
      Object.assign(document.createElement('template'), {
        innerHTML: html,
      }).content.firstElementChild
    )
  })
}
