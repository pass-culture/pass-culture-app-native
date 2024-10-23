import { useCallback, useMemo } from 'react'
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

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState, dispatch } = useSearch()
  const { data } = useSubcategories()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { navigateToSearch: navigateToSearchN1 } = useNavigateToSearch('SearchN1')
  const { disabilities } = useAccessibilityFiltersContext()
  const enableWipPageSearchN1Books = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1)
  const enableWipPageSearchN1Cinema = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SEARCH_N1_CINEMA)
  const enableWipPageSearchN1FilmsDocumentairesEtSeries = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_N1_FILMS_DOCUMENTAIRES_ET_SERIES
  )
  const SEARCH_N1_CATEGORIES: (keyof typeof SearchGroupNameEnumv2 | undefined)[] = useMemo(
    () => [
      enableWipPageSearchN1Books ? 'LIVRES' : undefined,
      enableWipPageSearchN1Cinema ? 'CINEMA' : undefined,
      enableWipPageSearchN1FilmsDocumentairesEtSeries ? 'FILMS_DOCUMENTAIRES_SERIES' : undefined,
    ],
    [
      enableWipPageSearchN1Books,
      enableWipPageSearchN1Cinema,
      enableWipPageSearchN1FilmsDocumentairesEtSeries,
    ]
  )

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
      if (SEARCH_N1_CATEGORIES.includes(pressedCategory)) {
        dispatch({
          type: 'SET_STATE',
          payload: newSearchState,
        })
        navigateToSearchN1(newSearchState, disabilities)
      } else {
        navigateToSearchResults(newSearchState, disabilities)
      }
    },
    [
      SEARCH_N1_CATEGORIES,
      data,
      disabilities,
      navigateToSearchN1,
      navigateToSearchResults,
      searchState,
      dispatch,
    ]
  )
}
