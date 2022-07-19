import { useCallback } from 'react'

import { OnCategoryPress } from 'features/search/components/CategoriesButtons'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'

import { usePushWithStagedSearch } from './usePushWithStagedSearch'

export const useShowResultsForCategory = (): OnCategoryPress => {
  const { dispatch: stagedDispatch } = useStagedSearch()
  const showResultsWithStagedSearch = usePushWithStagedSearch()

  return useCallback(
    (pressedCategory) => {
      stagedDispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
      showResultsWithStagedSearch({
        offerCategories: [pressedCategory],
        showResults: true,
      })
    },
    [stagedDispatch, showResultsWithStagedSearch]
  )
}
