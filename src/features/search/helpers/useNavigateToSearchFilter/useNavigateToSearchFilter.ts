import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { SearchState, SearchView } from 'features/search/types'

export const useNavigateToSearchFilter = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearchFilter = (newSearchState: SearchState): void => {
    navigate(...getSearchStackConfig(SearchView.Filter, newSearchState))
  }
  return { navigateToSearchFilter }
}
