export default {
  install: `pnpm create vite@latest arrow-app --template vanilla-ts
cd arrow-app
pnpm add @arrow-js/core @arrow-js/framework @arrow-js/ssr @arrow-js/hydrate
pnpm add -D vite@8`,

  app: `import { component, html } from '@arrow-js/core'
import { boundary } from '@arrow-js/framework'

type WelcomeProps = {
  message: string
}

const Welcome = component(async ({ message }: WelcomeProps) =>
  html\`<p>\${message}</p>\`
)

export function createApp() {
  return html\`<main>
    <h1>Arrow + Vite 8</h1>
    \${boundary(Welcome({ message: 'SSR first. Hydrated when the browser boots.' }))}
  </main>\`
}`,

  server: `import { renderToString, serializePayload } from '@arrow-js/ssr'
import { createApp } from './App'

export async function renderPage(): Promise<string> {
  const result = await renderToString(createApp())

  return \`<!doctype html>
  <html>
    <body>
      <div id="app">\${result.html}</div>
      \${serializePayload(result.payload)}
      <script type="module" src="/src/entry-client.ts"></script>
    </body>
  </html>\`
}`,

  client: `import { hydrate, readPayload } from '@arrow-js/hydrate'
import { createApp } from './App'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Missing #app root')
}

await hydrate(root, createApp(), readPayload())`,

  asyncComponent: `import { component, html } from '@arrow-js/core'
import { boundary } from '@arrow-js/framework'

type User = {
  id: string
  name: string
}

const UserName = component(async ({ id }: { id: string }) => {
  const user = await fetch(\`/api/users/\${id}\`).then(
    (r) => r.json() as Promise<User>
  )

  return user.name
})

const UserCard = component((props: { id: string }) =>
  html\`<article>\${UserName(props)}</article>\`
)

export const view = html\`<main>
  \${boundary(UserCard({ id: '42' }))}
</main>\``,
}
