import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { OnPressCategory } from 'features/search/helpers/useSortedSearchCategories/useSearchLandingButtonsProps'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState, dispatch } = useSearch()
  const { data } = useSubcategories()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { navigateToSearch: navigateToThematicSearch } = useNavigateToSearch('ThematicSearch')
  const { disabilities } = useAccessibilityFiltersContext()
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
  const THEMATIC_SEARCH_CATEGORIES: (SearchGroupNameEnumv2 | undefined)[] = useMemo(
    () => [
      enableWipPageThematicSearchBooks ? SearchGroupNameEnumv2.LIVRES : undefined,
      enableWipPageThematicSearchCinema ? SearchGroupNameEnumv2.CINEMA : undefined,
      enableWipPageThematicSearchFilmsDocumentairesEtSeries
        ? SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES
        : undefined,
      enableWipPageThematicSearchMusic ? SearchGroupNameEnumv2.MUSIQUE : undefined,
    ],
    [
      enableWipPageThematicSearchBooks,
      enableWipPageThematicSearchCinema,
      enableWipPageThematicSearchFilmsDocumentairesEtSeries,
      enableWipPageThematicSearchMusic,
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
        offerGenreTypes: undefined,
        searchId,
        isFromHistory: undefined,
      }
      if (
        pressedCategory in SearchGroupNameEnumv2 &&
        THEMATIC_SEARCH_CATEGORIES.includes(pressedCategory as SearchGroupNameEnumv2)
      ) {
        dispatch({
          type: 'SET_STATE',
          payload: newSearchState,
        })
        navigateToThematicSearch(newSearchState, disabilities)
      } else {
        navigateToSearchResults(newSearchState, disabilities)
      }
    },
    [
      THEMATIC_SEARCH_CATEGORIES,
      data,
      disabilities,
      navigateToThematicSearch,
      navigateToSearchResults,
      searchState,
      dispatch,
    ]
  )
}
