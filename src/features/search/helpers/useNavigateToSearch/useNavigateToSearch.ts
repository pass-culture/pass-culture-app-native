import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearch = (newSearchState: SearchState): void => {
    navigate(...getTabNavConfig('Search', newSearchState))
  }
  return { navigateToSearch }
}
