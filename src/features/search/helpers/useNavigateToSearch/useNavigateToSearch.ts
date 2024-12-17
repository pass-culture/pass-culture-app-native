import { StackActions, useNavigation } from '@react-navigation/native'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = (routeName: SearchStackRouteName) => {
  const { navigate, dispatch } = useNavigation<UseNavigationType>()
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

  const replaceToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter: DisabilitiesProperties
  ): void => {
    const replaceAction = StackActions.replace(routeName, {
      ...newSearchState,
      accessibilityFilter: newAccessibilityFilter,
    })

    dispatch(replaceAction)
  }

  return { navigateToSearch, replaceToSearch }
}
