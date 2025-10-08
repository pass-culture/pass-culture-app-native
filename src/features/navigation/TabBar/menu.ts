import { TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'

export const menu: Record<
  Exclude<TabRouteName, '_DeeplinkOnlyHome1' | '_DeeplinkOnlyBookings1'>,
  { displayName: string; accessibilityLabel?: string }
> = {
  Home: { displayName: 'Accueil', accessibilityLabel: 'Accueil' },
  SearchStackNavigator: { displayName: 'Recherche', accessibilityLabel: 'Rechercher des offres' },
  Bookings: { displayName: 'Réservations', accessibilityLabel: 'Mes réservations' },
  Favorites: { displayName: 'Favoris', accessibilityLabel: 'Mes favoris' },
  Profile: { displayName: 'Profil', accessibilityLabel: 'Mon profil' },
}
