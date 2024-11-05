import { DisabilitiesProperties } from 'features/accessibility/types'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName = keyof SearchStackParamList

export type SearchStackParamList = {
  SearchLanding?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SearchResults?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  ThematicSearch?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
}

export type SearchStackScreenNames = keyof SearchStackParamList

export type SearchStackRoute = GenericRoute<SearchStackParamList>
