import { SearchGroupNameEnumv2 } from 'api/gen'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { SearchState } from 'features/search/types'

export type SearchStackRouteName =
  'SearchLanding' | 'SearchResults' | 'ThematicSearch' | 'ThematicSearchSubcategories'

export const hasAThematicSearch = [
  SearchGroupNameEnumv2.CINEMA,
  SearchGroupNameEnumv2.LIVRES,
  SearchGroupNameEnumv2.MUSIQUE,
  SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
] as const

type HasAThematicSearch = typeof hasAThematicSearch

export type ThematicSearchCategories = Extract<SearchGroupNameEnumv2, HasAThematicSearch[number]>

export type SearchStackParamList = {
  SearchLanding?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SearchResults?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  ThematicSearch?: Partial<
    SearchState & {
      offerCategories: ThematicSearchCategories[]
      accessibilityFilter: Partial<DisabilitiesProperties>
    }
  >
  ThematicSearchSubcategories?: Partial<
    SearchState & {
      offerCategories: ThematicSearchCategories[]
      accessibilityFilter: Partial<DisabilitiesProperties>
    }
  >
}
