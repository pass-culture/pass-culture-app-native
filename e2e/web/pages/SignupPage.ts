import { Locator, Page } from '@playwright/test'

import { CookieBanner } from './CookieBanner'

const FRENCH_MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export class SignupPage {
  readonly emailInput: Locator
  readonly newsletterCheckbox: Locator
  readonly emailStepContinueButton: Locator
  readonly passwordInput: Locator
  readonly passwordStepContinueButton: Locator
  readonly dayInput: Locator
  readonly monthInput: Locator
  readonly yearInput: Locator
  readonly birthdayStepContinueButton: Locator
  readonly cguCheckbox: Locator
  readonly dataCharterCheckbox: Locator
  readonly submitButton: Locator
  readonly confirmationEmailHeading: Locator

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel(/^Champs de texte - Adresse e-mail/)
    this.newsletterCheckbox = page.getByRole('checkbox', {
      name: 'J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture.',
    })
    this.emailStepContinueButton = page.getByRole('button', {
      name: /Continuer vers l.étape Mot de passe/,
    })
    this.passwordInput = page.getByLabel(/^Champs de texte - Mot de passe/)
    this.passwordStepContinueButton = page.getByRole('button', {
      name: /Continuer vers l.étape Date de naissance/,
    })
    this.dayInput = page.getByTestId('select-Jour')
    this.monthInput = page.getByTestId('select-Mois')
    this.yearInput = page.getByTestId('select-Année')
    this.birthdayStepContinueButton = page.getByRole('button', {
      name: /Continuer vers l.étape CGU/,
    })
    this.cguCheckbox = page.getByRole('checkbox', {
      name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
    })
    this.dataCharterCheckbox = page.getByRole('checkbox', {
      name: 'J’ai lu les chartes des données personnelles',
    })
    this.submitButton = page.getByRole('button', { name: /S’inscrire/ })
    this.confirmationEmailHeading = page.getByText('Confirme ton adresse e-mail')
  }

  async goto() {
    await this.page.goto('/creation-compte-methodes')
    await new CookieBanner(this.page).acceptAll()
    await this.page.getByRole('link', { name: 'S’inscrire avec mon e-mail' }).click()
  }

  async signUp(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.newsletterCheckbox.check()
    await this.page.waitForTimeout(1000)
    await this.emailStepContinueButton.click()

    await this.passwordInput.fill(password)
    await this.passwordStepContinueButton.click()

    const birthdate = new Date()
    birthdate.setFullYear(birthdate.getFullYear() - 20)
    await this.dayInput.selectOption(String(birthdate.getDate()))
    await this.monthInput.selectOption(FRENCH_MONTHS[birthdate.getMonth()])
    await this.yearInput.selectOption(String(birthdate.getFullYear()))
    await this.birthdayStepContinueButton.click()

    await this.cguCheckbox.check()
    await this.dataCharterCheckbox.check()
    await this.submitButton.click()
  }
}
