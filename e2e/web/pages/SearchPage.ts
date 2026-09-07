import { Locator, Page } from '@playwright/test'

export class SearchPage {
  readonly heading: Locator
  readonly categoriesHeading: Locator
  // "Tout parcourir" only exists once a category's thematic page has loaded.
  readonly thematicPageHeading: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Rechercher', level: 1 })
    this.categoriesHeading = page.getByRole('heading', { name: 'Parcours les catégories' })
    this.thematicPageHeading = page.getByRole('heading', { name: 'Tout parcourir' })
  }

  categoryLink(categoryName: string) {
    return this.page.getByRole('link', { name: `Catégorie ${categoryName}` })
  }

  async openCategory(categoryName: string) {
    await this.categoryLink(categoryName).click()
  }
}
