import { expect, test } from '../fixtures'

test.describe('search', () => {
  test('browsing a category from the search tab shows its offers', async ({
    homePage,
    navigationBar,
    searchPage,
  }) => {
    await navigationBar.goToSearch()
    await expect(searchPage.heading).toBeVisible()
    await expect(searchPage.categoriesHeading).toBeVisible()

    await searchPage.openCategory('Cinéma')

    await expect(searchPage.thematicPageHeading).toBeVisible()
  })
})
