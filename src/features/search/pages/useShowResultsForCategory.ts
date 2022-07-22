import { useCallback } from 'react'

import { OnPressCategory } from 'features/search/components/CategoriesButtons'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'

import { SearchView } from '../types'

import { usePushWithStagedSearch } from './usePushWithStagedSearch'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { dispatch: stagedDispatch } = useStagedSearch()
  const pushWithStagedSearch = usePushWithStagedSearch()

  return useCallback(
    (pressedCategory) => {
      stagedDispatch({ type: 'SET_CATEGORY', payload: [pressedCategory] })
      pushWithStagedSearch({
        offerCategories: [pressedCategory],
        view: SearchView.Results,
      })
    },
    [stagedDispatch, pushWithStagedSearch]
  )
}
