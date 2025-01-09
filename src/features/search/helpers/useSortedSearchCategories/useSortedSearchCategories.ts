import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { ListCategoryButtonProps } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { isOnlyOnline } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { CategoryButtonProps } from 'shared/categoryButton/CategoryButton'

export type MappingOutput = CategoryButtonProps & { position: number | undefined }

export function categoriesSortPredicate(a: MappingOutput, b: MappingOutput): number {
  const positionA: number = a?.position || 0
  const positionB: number = b?.position || 0
  return positionA - positionB
}

export const useSortedSearchCategories = (): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const categories = useAvailableCategories()
  const { data } = useSubcategories()
  const enableWipPageThematicSearchBooks = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1
  )
  const enableWipPageThematicSearchCinema = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_N1_CINEMA
  )
  const enableWipPageThematicSearchFilmsDocumentairesEtSeries = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_N1_FILMS_DOCUMENTAIRES_ET_SERIES
  )
  const enableWipPageThematicSearchMusic = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_THEMATIC_SEARCH_MUSIC
  )
  const hasAThematicSearch = [
    enableWipPageThematicSearchBooks ? 'LIVRES' : undefined,
    enableWipPageThematicSearchCinema ? 'CINEMA' : undefined,
    enableWipPageThematicSearchFilmsDocumentairesEtSeries
      ? 'FILMS_DOCUMENTAIRES_SERIES'
      : undefined,
    enableWipPageThematicSearchMusic ? 'MUSIQUE' : undefined,
  ]

  const navigateToSearch = (facetFilter: SearchGroupNameEnumv2) => {
    const searchTabConfig = getSearchStackConfig(
      hasAThematicSearch.includes(facetFilter) ? 'ThematicSearch' : 'SearchResults',
      {
        offerCategories: [facetFilter],
        isFullyDigitalOffersCategory: (data && isOnlyOnline(data, facetFilter)) || undefined,
        offerSubcategories: [],
        offerNativeCategories: undefined,
        offerGenreTypes: undefined,
        searchId: uuidv4(),
        isFromHistory: undefined,
      }
    )
    return { screen: searchTabConfig[0], params: searchTabConfig[1], withPush: true } // check if vraiment true
  }

  return categories
    .map<MappingOutput>((category) => ({
      label: searchGroupLabelMapping?.[category.facetFilter] || '',
      navigateTo: navigateToSearch(category.facetFilter),
      position: category.position,
      textColor: category.textColor,
      borderColor: category.borderColor,
      fillColor: category.fillColor,
    }))
    .sort(categoriesSortPredicate)
}
