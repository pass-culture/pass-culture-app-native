import { expect, test } from '../fixtures'

test.describe('favorites', () => {
  test('prompts a guest to sign in to access favorites', async ({
    homePage,
    navigationBar,
    favoritesPage,
  }) => {
    await navigationBar.goToFavorites()

    await expect(favoritesPage.signInPrompt).toBeVisible()
    await expect(favoritesPage.createAccountLink).toBeVisible()
    await expect(favoritesPage.signInLink).toBeVisible()
  })
})
