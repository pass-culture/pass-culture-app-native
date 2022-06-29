import { useCallback } from 'react'

import { OnPressCategory } from 'features/search/components/CategoriesButtons'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'

import { useShowResultsWithStagedSearch } from './useShowResultsWithStagedSearch'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { dispatch: stagedDispatch } = useStagedSearch()
  const showResultsWithStagedSearch = useShowResultsWithStagedSearch()
  const { dispatch } = useSearch()

  return useCallback(
    (pressedCategory) => {
      stagedDispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
      showResultsWithStagedSearch()
      dispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
    },
    [stagedDispatch, dispatch, showResultsWithStagedSearch]
  )
}
