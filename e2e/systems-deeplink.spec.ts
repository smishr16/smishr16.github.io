import { test, expect } from '@playwright/test'

/**
 * Smoke: deep-linked systems demos mount; Run loads frames; knobs work.
 */
async function openLab(page: import('@playwright/test').Page, search: string) {
  await page.goto(`/lab/systems${search}`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.ide')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('button', { name: 'Run' })).toBeVisible({ timeout: 10_000 })
}

async function runAndExpectLoaded(page: import('@playwright/test').Page, namePart: RegExp) {
  await page.getByRole('button', { name: 'Run' }).click()
  // systemsLab sets console to `Loaded ${demo.label}…`
  await expect(page.locator('#console')).toContainText(namePart, { timeout: 10_000 })
}

test.describe('systems lab deep-links', () => {
  test('default systems lab loads RR and Run reports Loaded', async ({ page }) => {
    await openLab(page, '')
    await runAndExpectLoaded(page, /Loaded/i)
    // Either status moved off Ready or concept shows schedule content
    const status = page.locator('#viz-status')
    const concept = page.locator('#concept')
    await expect
      .poll(async () => {
        const s = (await status.textContent()) ?? ''
        const c = (await concept.textContent()) ?? ''
        return s !== 'Ready.' || /RR|Round|FCFS|schedule|Teaching/i.test(c)
      })
      .toBeTruthy()
  })

  test('deep-link systemsDemo=dfa-mod3', async ({ page }) => {
    await openLab(page, '?systemsDemo=dfa-mod3')
    await expect(page.locator('[data-demo="dfa-mod3"]')).toHaveAttribute('aria-selected', 'true')
    await runAndExpectLoaded(page, /Loaded|mod/i)
    await expect(page.locator('#demo-opts')).toBeVisible()
    await page.locator('#demo-input').fill('11')
    await page.getByRole('button', { name: 'Run' }).click()
    await expect(page.locator('#console')).toContainText(/Loaded/i)
  })

  test('deep-link systemsDemo=gbn-loss with step', async ({ page }) => {
    await openLab(page, '?systemsDemo=gbn-loss&step=2')
    await expect(page.locator('[data-demo="gbn-loss"]')).toHaveAttribute('aria-selected', 'true')
    await runAndExpectLoaded(page, /Loaded|GBN/i)
    await expect(page.locator('#demo-opts')).toBeVisible()
    await page.locator('#demo-input').fill('4,2')
    await page.getByRole('button', { name: 'Run' }).click()
    await expect(page.locator('#concept')).toContainText(/GBN|loss|window/i)
  })

  test('deep-link systemsDemo=tcp-aimd', async ({ page }) => {
    await openLab(page, '?systemsDemo=tcp-aimd')
    await expect(page.locator('[data-demo="tcp-aimd"]')).toHaveAttribute('aria-selected', 'true')
    await runAndExpectLoaded(page, /Loaded|AIMD|TCP/i)
    await page.getByRole('button', { name: 'Step' }).click()
  })

  test('deep-link systemsDemo=join-compare', async ({ page }) => {
    await openLab(page, '?systemsDemo=join-compare')
    await expect(page.locator('[data-demo="join-compare"]')).toHaveAttribute('aria-selected', 'true')
    await runAndExpectLoaded(page, /Loaded|Join|cost/i)
    await expect(page.locator('#concept')).toContainText(/Join|hash|NLJ|cost|Teaching/i)
  })

  test('unknown demo surfaces error without crashing shell', async ({ page }) => {
    await openLab(page, '?systemsDemo=not-a-real-demo')
    // mount auto-runs and may already error
    await expect(page.locator('#console')).toContainText(/Error|Unknown/i, { timeout: 10_000 })
    await expect(page.locator('.ide')).toBeVisible()
  })
})

test.describe('smoke: course + sorting lab', () => {
  test('home and learn render', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.goto('/learn')
    await expect(page.locator('#catalog-search, .course-card').first()).toBeVisible()
  })

  test('sorting lab loads and Run', async ({ page }) => {
    await page.goto('/lab/sorting')
    await expect(page.locator('.ide')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Run' }).click()
    await expect(page.locator('#console')).toContainText(/Reference|Python|Compare|sort|n=/i, {
      timeout: 15_000,
    })
  })
})
