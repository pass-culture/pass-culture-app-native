import AppScreen from '../../screenobjects/AppScreen'
import { flags } from '../../helpers/utils/platform'

class TabBar extends AppScreen {
  homeTabSelector: string
  searchTabSelector: string
  bookingsTabSelector: string
  favoritesTabSelector: string
  profilTabSelector: string

  constructor() {
    let homeTabSelector
    let searchTabSelector
    let bookingsTabSelector
    let favoritesTabSelector
    let profilTabSelector
    if (flags.isWeb) {
      homeTabSelector = '[data-testid="Home tab"]'
      searchTabSelector = '[data-testid="Search tab"]'
      bookingsTabSelector = '[data-testid="Bookings tab"]'
      favoritesTabSelector = '[data-testid="Favorites tab"]'
      profilTabSelector = '[data-testid="Profile tab"]'
    } else {
      homeTabSelector = '~Accueil'
      searchTabSelector = '~Rechercher des offres'
      bookingsTabSelector = '~Mes réservations'
      favoritesTabSelector = '~Mes favoris'
      profilTabSelector = '~Mon profil'
    }
    super(searchTabSelector)
    this.homeTabSelector = homeTabSelector
    this.searchTabSelector = searchTabSelector
    this.bookingsTabSelector = bookingsTabSelector
    this.favoritesTabSelector = favoritesTabSelector
    this.profilTabSelector = profilTabSelector
  }

  get home() {
    return $(this.homeTabSelector)
  }

  get search() {
    return $(this.searchTabSelector)
  }

  get bookings() {
    return $(this.bookingsTabSelector)
  }

  get favorite() {
    return $(this.favoritesTabSelector)
  }

  get profil() {
    return $(this.profilTabSelector)
  }
}

export default new TabBar()
