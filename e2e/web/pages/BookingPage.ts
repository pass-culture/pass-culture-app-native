import { Locator, Page } from '@playwright/test'

export class BookingPage {
  readonly detailsHeading: Locator
  readonly cguCheckbox: Locator
  readonly confirmButton: Locator
  readonly successHeading: Locator
  readonly viewBookingLink: Locator
  readonly cancelBookingButton: Locator
  readonly cancelSuccessMessage: Locator

  constructor(private readonly page: Page) {
    this.detailsHeading = page.getByText('Détails de la réservation')
    this.cguCheckbox = page.getByRole('checkbox', {
      name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
    })
    this.confirmButton = page.getByRole('button', { name: 'Confirmer la réservation' })
    this.successHeading = page.getByText('Réservation confirmée\u00a0!')
    this.viewBookingLink = page.getByRole('button', { name: 'Voir ma réservation' })
    this.cancelBookingButton = page.getByRole('button', { name: 'Annuler ma réservation' })
    this.cancelSuccessMessage = page.getByText('La réservation a bien été annulée')
  }

  async confirm() {
    await this.cguCheckbox.check()
    await this.confirmButton.click()
  }

  async goToBooking() {
    await this.viewBookingLink.click()
  }

  async cancel() {
    await this.cancelBookingButton.click()
    await this.page
      .getByTestId('modalScrollView')
      .getByRole('button', { name: 'Annuler ma réservation' })
      .click()
  }
}
