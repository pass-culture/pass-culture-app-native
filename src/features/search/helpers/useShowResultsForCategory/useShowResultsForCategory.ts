import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/context/SearchWrapper'
import { isOnlyOnline } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { OnPressCategory } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data } = useSubcategories()

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
        view: SearchView.Results,
        searchId,
        isOnline: isOnlyOnline(data, pressedCategory) || undefined,
      }
      analytics.logPerformSearch({ ...newSearchState, view: SearchView.Landing })
      navigate(...getTabNavConfig('Search', newSearchState))
    },
    [data, navigate, searchState]
  )
}
