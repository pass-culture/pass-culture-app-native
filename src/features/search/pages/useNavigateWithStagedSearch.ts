import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SearchState } from 'features/search/types'

export const useNavigateWithStagedSearch = () => {
  const { searchState: stagedSearchState } = useStagedSearch()
  const { push } = useNavigation<UseNavigationType>()

  return useCallback(
    (partialSearchState?: Partial<SearchState>) => {
      push(
        ...getTabNavConfig('Search', {
          ...stagedSearchState,
          ...(partialSearchState || {}),
        })
      )
    },
    [push, stagedSearchState]
  )
}
