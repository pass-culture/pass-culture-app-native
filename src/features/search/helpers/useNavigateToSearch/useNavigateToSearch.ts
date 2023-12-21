import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = () => {
  const { dispatch } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearch = (newSearchState: SearchState): void => {
    dispatch({
      type: 'SET_STATE',
      payload: newSearchState,
    })
    navigate(...getTabNavConfig('Search'))
  }
  return { navigateToSearch }
}
