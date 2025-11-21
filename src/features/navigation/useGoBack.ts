import { useNavigation } from '@react-navigation/native'
import { Platform } from 'react-native'

import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'

/**
 * Go back to the previous route in history,
 * or go back to some specified route if no previous route exists.
 *
 * @param ...navigateParams - Same parameters as navigate(...) function.
 */
export function useGoBack<RouteName extends keyof RootStackParamList>(
  ..._navigateParams: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName] | [RouteName, RootStackParamList[RouteName]]
) {
  const { canGoBack, goBack } = useNavigation<UseNavigationType>()

  function customCanGoBack(): boolean {
    if (Platform.OS !== 'web') {
      return canGoBack()
    }
    let can = canGoBack()
    if (!can && window) {
      can = window.history.length > 2 // checked on FF & Chrome and it's 2
    }
    return can
  }

  return { goBack, canGoBack: customCanGoBack }
}
