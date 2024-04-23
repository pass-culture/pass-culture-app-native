import { DisabilitiesProperties } from 'features/accessibility/types'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName = keyof SearchStackParamList

export type SearchStackParamList = {
  Search?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SearchN1Books?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
}

export type SearchStackScreenNames = keyof SearchStackParamList

export type SearchStackRoute = GenericRoute<SearchStackParamList>
