import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useSearch } from 'features/search/context/SearchWrapper'
import { isOnlyOnline } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { OnPressCategory } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { SearchView } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState, dispatch } = useSearch()
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
        isFullyDigitalOffersCategory: isOnlyOnline(data, pressedCategory) || undefined,
        isFromHistory: undefined,
      }
      dispatch({ type: 'SET_STATE', payload: newSearchState })
    },
    [data, dispatch, searchState]
  )
}
