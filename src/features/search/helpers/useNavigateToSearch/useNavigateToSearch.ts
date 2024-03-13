import { useNavigation } from '@react-navigation/native'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter: DisabilitiesProperties
  ): void => {
    navigate(
      ...getTabNavConfig('Search', {
        ...newSearchState,
        accessibilityFilter: newAccessibilityFilter,
      })
    )
  }
  return { navigateToSearch }
}
