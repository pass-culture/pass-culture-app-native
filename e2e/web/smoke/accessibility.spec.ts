import { expect, test } from '../fixtures'

const pages = [
  { name: 'home', path: '/accueil' },
  { name: 'search', path: '/recherche/accueil' },
  { name: 'thematic search', path: '/recherche/thematique?offerCategories=%5B%22CINEMA%22%5D' },
  { name: 'bookings', path: '/reservations' },
  { name: 'favorites', path: '/favoris' },
  { name: 'profile', path: '/profil' },
  { name: 'login', path: '/connexion' },
]

test.describe('accessibility', () => {
  for (const { name, path } of pages) {
    test(`${name} page opened from its URL has exactly one main landmark`, async ({ page }) => {
      await page.goto(path)
      await page.getByRole('main').first().waitFor()

      await expect(page.getByRole('main')).toHaveCount(1)
    })
  }
})
