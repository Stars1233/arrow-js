import { expect, test } from '@playwright/test'
import { playgroundExampleHref, playgroundExampleMeta } from '../../docs/play/example-meta.js'

test('playground loads the multi-file dropdown example', async ({ page }) => {
  const messages: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      messages.push(msg.text())
    }
  })

  await page.goto('/play/?example=dropdowns')

  await expect(page.locator('.play-example')).toHaveCount(0)
  await expect(page.locator('.play-file-name')).toHaveText([
    'main.ts',
    'Dropdown.ts',
    'DropdownGallery.ts',
    'FieldCard.ts',
    'styles.css',
  ])

  const preview = page.frameLocator('#play-preview')

  await expect
    .poll(() => preview.locator('#runtime-error').getAttribute('data-active'))
    .toBe('false')
  await expect
    .poll(() =>
      preview
        .locator('#app')
        .evaluate((node) => (node.textContent || '').trim().length > 0)
    )
    .toBe(true)

  expect(messages).toEqual([])
})

test('playground loads every registered example by direct url', async ({ page }) => {
  const preview = page.frameLocator('#play-preview')

  expect(playgroundExampleMeta.length).toBeGreaterThan(6)

  for (const example of playgroundExampleMeta) {
    await page.goto(playgroundExampleHref(example.id))

    await expect(page.locator('.play-example')).toHaveCount(0)
    await expect
      .poll(() => preview.locator('#runtime-error').getAttribute('data-active'))
      .toBe('false')
    await expect
      .poll(() =>
        preview
          .locator('#app')
          .evaluate((node) => (node.textContent || '').trim().length > 0)
      )
      .toBe(true)
  }
})
