import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/pages/reducer'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SearchState } from 'features/search/types'

export const usePushWithStagedSearch = () => {
  const { searchState: stagedSearchState } = useStagedSearch()
  const { push } = useNavigation<UseNavigationType>()

  return useCallback(
    (partialSearchState?: Partial<SearchState>, options: { reset?: boolean } = {}) => {
      push(
        ...getTabNavConfig('Search', {
          ...stagedSearchState,
          ...(options.reset ? initialSearchState : {}),
          ...(partialSearchState || {}),
        })
      )
    },
    [push, stagedSearchState]
  )
}
