import { Locator, Page } from '@playwright/test'

export class FavoritesPage {
  readonly signInPrompt: Locator
  readonly createAccountLink: Locator
  readonly signInLink: Locator

  constructor(private readonly page: Page) {
    this.signInPrompt = page.getByRole('heading', {
      name: 'Identifie-toi pour retrouver tes favoris',
    })
    this.createAccountLink = page.getByRole('link', { name: 'Créer un compte' })
    this.signInLink = page.getByRole('link', { name: 'Se connecter' })
  }
}
