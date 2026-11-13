import { Locator, Page } from '@playwright/test'

export class OfferPage {
  readonly favoriteButton: Locator
  readonly unfavoriteButton: Locator
  readonly reserveButton: Locator

  constructor(private readonly page: Page) {
    this.favoriteButton = page.getByRole('button', { name: 'Mettre en favori' })
    this.unfavoriteButton = page.getByRole('button', { name: 'Retirer des favoris' })
    this.reserveButton = page.getByRole('button', { name: /Réserver l.offre/ })
  }

  async goto(offerId: number) {
    await this.page.goto(`/offre/${offerId}`)
  }

  async addToFavorites() {
    await this.favoriteButton.click()
  }

  async reserve() {
    await this.reserveButton.click()
  }
}
