import { Page } from '@playwright/test'

export class CookieBanner {
  constructor(private readonly page: Page) {}

  async acceptAll() {
    await this.page.getByRole('button', { name: 'Tout accepter' }).click()
  }
}
