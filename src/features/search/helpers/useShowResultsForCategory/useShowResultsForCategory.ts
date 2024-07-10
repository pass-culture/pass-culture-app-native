import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useSearch } from 'features/search/context/SearchWrapper'
import { isOnlyOnline } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { OnPressCategory } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

const SEARCH_N1_CATEGORIES: (keyof typeof SearchGroupNameEnumv2)[] = ['LIVRES']

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState } = useSearch()
  const { data } = useSubcategories()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { navigateToSearch: navigateToSearchN1 } = useNavigateToSearch('SearchN1')
  const { disabilities } = useAccessibilityFiltersContext()
  const enableWipPageSearchN1 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1)

  return useCallback(
    (pressedCategory) => {
      if (!data) return
      const searchId = uuidv4()
      const newSearchState = {
        ...searchState,
        offerCategories: [pressedCategory],
        offerSubcategories: [],
        offerNativeCategories: undefined,
        offerGenreTypes: undefined,
        searchId,
        isFullyDigitalOffersCategory: isOnlyOnline(data, pressedCategory) || undefined,
        isFromHistory: undefined,
      }
      if (enableWipPageSearchN1 && SEARCH_N1_CATEGORIES.includes(pressedCategory)) {
        navigateToSearchN1(newSearchState, disabilities)
      } else {
        navigateToSearchResults(newSearchState, disabilities)
      }
    },
    [
      data,
      disabilities,
      enableWipPageSearchN1,
      navigateToSearchN1,
      navigateToSearchResults,
      searchState,
    ]
  )
}
