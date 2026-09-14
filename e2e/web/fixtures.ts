import { test as base } from '@playwright/test'

import { CookieBanner } from './pages/CookieBanner'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { NavigationBar } from './pages/NavigationBar'
import { SearchPage } from './pages/SearchPage'

type Fixtures = {
  homePage: HomePage
  navigationBar: NavigationBar
  searchPage: SearchPage
  favoritesPage: FavoritesPage
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
})

export { expect } from '@playwright/test'
