import { StackActions, useNavigation } from '@react-navigation/native'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { SearchState } from 'features/search/types'

export const useNavigateToSearch = (routeName) => {
  const { popTo, dispatch } = useNavigation<UseNavigationType>()
  const navigateToSearch = (
    newSearchState: SearchState,
    newAccessibilityFilter?: DisabilitiesProperties
  ): void => {
    popTo('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: routeName,
        params: {
          ...newSearchState,
          accessibilityFilter: newAccessibilityFilter ?? defaultDisabilitiesProperties,
        },
      },
    })
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
