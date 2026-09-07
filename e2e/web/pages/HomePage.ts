import { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly welcomeHeading: Locator
  readonly unlockCreditBanner: Locator

  constructor(private readonly page: Page) {
    this.welcomeHeading = page.getByRole('heading', { name: 'Bienvenue !' })
    this.unlockCreditBanner = page.getByText('Débloque ton crédit')
  }

  async goto() {
    await this.page.goto('/')
  }
}
