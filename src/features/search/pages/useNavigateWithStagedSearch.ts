import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SearchState } from 'features/search/types'

export const useNavigateWithStagedSearch = () => {
  const { searchState: stagedSearchState } = useStagedSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  return useCallback(
    (partialSearchState?: Partial<SearchState>) => {
      navigate(
        ...getTabNavConfig('Search', {
          ...stagedSearchState,
          ...(partialSearchState || {}),
        })
      )
    },
    [navigate, stagedSearchState]
  )
}
