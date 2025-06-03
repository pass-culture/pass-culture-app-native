import { SearchGroupNameEnumv2 } from 'api/gen'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName = keyof SearchStackParamList

export const hasAThematicSearch = [
  SearchGroupNameEnumv2.CINEMA,
  SearchGroupNameEnumv2.LIVRES,
  SearchGroupNameEnumv2.MUSIQUE,
  SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
] as const

type HasAThematicSearch = typeof hasAThematicSearch

type ThematicSearchCategories = Extract<SearchGroupNameEnumv2, HasAThematicSearch[number]>

export type SearchStackParamList = {
  AISearch?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
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
