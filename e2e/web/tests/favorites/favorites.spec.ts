import { expect, test } from '../../fixtures'

test.describe('favorites', { tag: '@smoke' }, () => {
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

  test('a beneficiary user can add an offer to their favorites', async ({
    authenticatedPage,
    offerPage,
    cinemaOffer,
  }) => {
    await offerPage.goto(cinemaOffer.id)
    await offerPage.addToFavorites()

    await expect(offerPage.unfavoriteButton).toBeVisible()
  })
})
