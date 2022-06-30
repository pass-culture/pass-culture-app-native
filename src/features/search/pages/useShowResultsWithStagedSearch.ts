import { useCallback } from 'react'

import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'

export const useShowResultsWithStagedSearch = (): (() => void) => {
  const { dispatch } = useSearch()
  const { searchState: stagedSearchState } = useStagedSearch()

  return useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: stagedSearchState })
    dispatch({ type: 'SHOW_RESULTS', payload: true })
  }, [dispatch, stagedSearchState])
}
