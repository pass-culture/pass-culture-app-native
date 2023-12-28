import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export const useNavigateToSearchFilter = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearchFilter = (newSearchState: SearchState): void => {
    navigate('SearchFilter', newSearchState)
  }
  return { navigateToSearchFilter }
}
