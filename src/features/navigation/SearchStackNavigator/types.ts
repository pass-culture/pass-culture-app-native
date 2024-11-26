import { SearchGroupNameEnumv2 } from 'api/gen'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName = keyof SearchStackParamList

type HasAThematicSearch =
  | SearchGroupNameEnumv2.CINEMA
  | SearchGroupNameEnumv2.LIVRES
  | SearchGroupNameEnumv2.MUSIQUE
  | SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES

type ThematicSearchCategories = Extract<SearchGroupNameEnumv2, HasAThematicSearch>

export type SearchStackParamList = {
  SearchLanding?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SearchResults?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  ThematicSearch?: Partial<
    SearchState & {
      offerCategories: ThematicSearchCategories[]
      accessibilityFilter: Partial<DisabilitiesProperties>
    }
  >
}

export type SearchStackScreenNames = keyof SearchStackParamList

export type SearchStackRoute = GenericRoute<SearchStackParamList>
