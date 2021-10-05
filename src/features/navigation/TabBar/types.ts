import { GenericRoute } from 'features/navigation/RootNavigator'
import { SearchState } from 'features/search/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home?: { entryId?: string }
  Search?: Partial<SearchState>
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabRoute = GenericRoute<TabParamList>
