import { expect, test } from '../fixtures'

test.describe('navigation', () => {
  test('the tab bar reaches every main section', async ({ homePage, navigationBar, page }) => {
    await navigationBar.goToSearch()
    await expect(page).toHaveURL(/\/recherche\/accueil/)

    await navigationBar.goToFavorites()
    await expect(page).toHaveURL(/\/favoris/)

    await navigationBar.goToProfile()
    await expect(page).toHaveURL(/\/profil/)

    await navigationBar.goToHome()
    await expect(page).toHaveURL(/\/accueil/)
  })
})
