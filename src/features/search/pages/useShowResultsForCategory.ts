import { useCallback } from 'react'

import { OnPressCategory } from 'features/search/components/CategoriesButtons'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { dispatch } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()

  return useCallback(
    (pressedCategory) => {
      stagedDispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
      dispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    },
    [dispatch, stagedDispatch]
  )
}
