import { expect, test } from '../fixtures'

const pages = [
  { name: 'home', path: '/accueil' },
  { name: 'search', path: '/recherche/accueil' },
  { name: 'favorites', path: '/favoris' },
  { name: 'profile', path: '/profil' },
  { name: 'login', path: '/connexion' },
]

test.describe('accessibility', () => {
  for (const { name, path } of pages) {
    test(`${name} page opened from its URL has exactly one main landmark`, async ({ page }) => {
      await page.goto(path)

      await expect(page.getByRole('main')).toHaveCount(1)
    })
  }
})
