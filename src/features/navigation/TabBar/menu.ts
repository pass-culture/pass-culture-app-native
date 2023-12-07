import { Platform } from 'react-native'

import { TabRouteName } from 'features/navigation/TabBar/types'

const isWeb = Platform.OS === 'web'
export const menu: Record<TabRouteName, { displayName: string; accessibilityLabel?: string }> = {
  Home: { displayName: 'Accueil', accessibilityLabel: 'Accueil' },
  Search: { displayName: 'Recherche', accessibilityLabel: 'Rechercher des offres' },
  Bookings: { displayName: 'Réservations', accessibilityLabel: 'Mes réservations' },
  Favorites: { displayName: 'Favoris', accessibilityLabel: isWeb ? undefined : 'Mes favoris' },
  Profile: { displayName: 'Profil', accessibilityLabel: 'Mon profil' },
}
