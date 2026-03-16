import { renderToString, serializePayload } from '@arrow-js/ssr'
import { createPage } from './page'

function renderHead(page: ReturnType<typeof createPage>) {
  return [
    `<title>${page.title}</title>`,
    `<meta name="description" content="${page.description}" />`,
  ].join('')
}

export async function renderPage(url: string) {
  const page = createPage(url)
  const result = await renderToString(page.view)

  return {
    head: renderHead(page),
    html: result.html,
    payloadScript: serializePayload(result.payload),
    status: page.status,
  }
}
