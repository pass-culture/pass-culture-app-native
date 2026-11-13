import { test as base } from '@playwright/test'

import { deactivateOffer, generateBeneficiaryUser, generateCinemaOffer } from './helpers/e2eApi'
import { BookingPage } from './pages/BookingPage'
import { CookieBanner } from './pages/CookieBanner'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NavigationBar } from './pages/NavigationBar'
import { OfferPage } from './pages/OfferPage'
import { SearchPage } from './pages/SearchPage'
import { SignupPage } from './pages/SignupPage'

type BeneficiaryUser = {
  email: string
  confirmationPath: string
}

type CinemaOffer = {
  id: number
  name: string
}

type Fixtures = {
  homePage: HomePage
  navigationBar: NavigationBar
  searchPage: SearchPage
  favoritesPage: FavoritesPage
  loginPage: LoginPage
  signupPage: SignupPage
  offerPage: OfferPage
  bookingPage: BookingPage
  beneficiaryUser: BeneficiaryUser
  authenticatedPage: import('@playwright/test').Page
  cinemaOffer: CinemaOffer
}

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await new CookieBanner(page).acceptAll()
    await use(homePage)
  },
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page))
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page))
  },
  favoritesPage: async ({ page }, use) => {
    await use(new FavoritesPage(page))
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page))
  },
  offerPage: async ({ page }, use) => {
    await use(new OfferPage(page))
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page))
  },

  beneficiaryUser: async ({ request }, use) => {
    const user = await generateBeneficiaryUser(request)
    await use({ email: user.email, confirmationPath: user.confirmationPath })
  },

  authenticatedPage: async ({ page, beneficiaryUser }, use) => {
    await page.goto(beneficiaryUser.confirmationPath)
    await new CookieBanner(page).acceptAll()
    await page.getByRole('link', { name: 'On y va !' }).click()
    await use(page)
  },

  cinemaOffer: async ({ request }, use) => {
    const offer = await generateCinemaOffer(request)
    await use(offer)
    await deactivateOffer(request, offer.id)
  },
})

export { expect } from '@playwright/test'
