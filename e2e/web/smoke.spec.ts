import { expect, test } from '@playwright/test'

test('displays the welcome screen', async ({ page }) => {
  await page.goto('/')

  await page.getByText('Tout accepter').click()

  await expect(page.getByText('Bienvenue !')).toBeVisible()
})