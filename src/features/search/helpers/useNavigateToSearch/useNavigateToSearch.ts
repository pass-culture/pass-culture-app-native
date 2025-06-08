import { StackActions, useNavigation } from '@react-navigation/native'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/getSearchStackConfig'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = (routeName: SearchStackRouteName) => {
  const { navigate, dispatch } = useNavigation<UseNavigationType>()
  const navigateToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter?: DisabilitiesProperties
  ): void => {
    navigate(
      ...getSearchStackConfig(routeName, {
        ...newSearchState,
        accessibilityFilter: newAccessibilityFilter ?? defaultDisabilitiesProperties,
      })
    )
  }

  const replaceToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter?: DisabilitiesProperties
  ): void => {
    const replaceAction = StackActions.replace(routeName, {
      ...newSearchState,
      accessibilityFilter: newAccessibilityFilter ?? defaultDisabilitiesProperties,
    })

    dispatch(replaceAction)
  }

  return { navigateToSearch, replaceToSearch }
}
