import { Locator, Page } from '@playwright/test'

import { CookieBanner } from './CookieBanner'

export class LoginPage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel(/^Champs de texte - Adresse e-mail/)
    this.passwordInput = page.getByLabel(/^Champs de texte - Mot de passe/)
    this.submitButton = page.getByRole('button', { name: 'Se connecter' })
  }

  async goto() {
    await this.page.goto('/connexion/email')
    await new CookieBanner(this.page).acceptAll()
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
