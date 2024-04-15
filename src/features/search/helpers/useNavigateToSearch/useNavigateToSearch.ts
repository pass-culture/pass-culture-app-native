import { useNavigation } from '@react-navigation/native'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { initialSearchStackRouteName } from 'features/navigation/SearchStackNavigator/routes'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = (
  routeName: SearchStackRouteName = initialSearchStackRouteName
) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter: DisabilitiesProperties
  ): void => {
    navigate(
      ...getSearchStackConfig(routeName, {
        ...newSearchState,
        accessibilityFilter: newAccessibilityFilter,
      })
    )
  }
  return { navigateToSearch }
}
