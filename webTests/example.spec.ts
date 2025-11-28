// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://app.staging.passculture.team/accueil')
  await page.getByTestId('Tout accepter').click()
  await page.getByTestId('Profile tab').click()
  await page.getByTestId('Créer un compte').click()
  await page.getByTestId('Revenir en arrière').click()
  await page.getByRole('link', { name: 'Se connecter' }).click()
  await page.getByRole('heading', { name: 'Connexion' }).click()
})
