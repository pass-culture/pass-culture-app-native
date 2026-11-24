import { Locator, Page } from '@playwright/test'

export class SearchPage {
  readonly heading: Locator
  readonly categoriesHeading: Locator
  readonly thematicPageHeading: Locator
  readonly offerLinks: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Rechercher', level: 1 })
    this.categoriesHeading = page.getByRole('heading', { name: 'Parcours les catégories' })
    this.thematicPageHeading = page.getByRole('heading', { name: 'Tout parcourir' })
    this.offerLinks = page.getByTestId('searchResults').getByRole('link', { name: /€/ })
  }

  categoryLink(categoryName: string) {
    return this.page.getByRole('link', { name: `Catégorie ${categoryName}` })
  }

  async openCategory(categoryName: string) {
    await this.categoryLink(categoryName).click()
  }

  subcategoryLink(subcategoryName: string) {
    return this.page.getByRole('link', { name: `Sous-catégorie ${subcategoryName}`, exact: true })
  }

  async openSubcategory(subcategoryName: string) {
    await this.subcategoryLink(subcategoryName).click()
  }

  async openFirstOffer() {
    await this.offerLinks.first().click()
  }
}
