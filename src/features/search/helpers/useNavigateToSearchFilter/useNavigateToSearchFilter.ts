import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'

export const useNavigateToSearchFilter = () => {
  const { dispatch } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearchFilter = (newSearchState: SearchState): void => {
    dispatch({
      type: 'SET_STATE',
      payload: newSearchState,
    })
    navigate('SearchFilter', newSearchState)
  }
  return { navigateToSearchFilter }
}
