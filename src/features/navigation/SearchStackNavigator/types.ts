import { DisabilitiesProperties } from 'features/accessibility/types'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName = keyof SearchStackParamList

type SearchStackParam = Partial<
  SearchState & {
    accessibilityFilter: Partial<DisabilitiesProperties>
  }
>

export type SearchStackParamList = {
  SearchLanding: SearchStackParam
} & {
  SearchResults: SearchStackParam
} & {
  SearchN1: SearchStackParam
}

export type SearchStackScreenNames = keyof SearchStackParamList

export type SearchStackRoute = GenericRoute<SearchStackParamList>
