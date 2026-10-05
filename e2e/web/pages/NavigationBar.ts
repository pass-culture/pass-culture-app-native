import { Page } from '@playwright/test'

// Tab bar links expose a longer accessible name than their visible label
// (e.g. "Rechercher des offres" for the "Recherche" tab), matching the
// selectors already used by the Maestro mobile flows for the same tab bar.
export class NavigationBar {
  constructor(private readonly page: Page) {}

  async goToHome() {
    await this.page.getByRole('link', { name: 'Accueil', exact: true }).click()
  }

  async goToSearch() {
    await this.page.getByRole('link', { name: 'Rechercher des offres' }).click()
  }

  async goToFavorites() {
    await this.page.getByRole('link', { name: 'Mes favoris' }).click()
  }

  async goToProfile() {
    await this.page.getByRole('link', { name: 'Mon profil' }).click()
  }
}
