import { useNavigation } from '@react-navigation/native'
import { Platform } from 'react-native'

import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'

/**
 * Go back to the previous route in history,
 * or go back to some specified route if no previous route exists.
 *
 * @param ...navigateParams - Same parameters as navigate(...) function.
 */
export function useGoBack<RouteName extends keyof RootStackParamList>(
  ...navigateParams: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName] | [RouteName, RootStackParamList[RouteName]]
) {
  const { canGoBack, goBack, popTo } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()

  function customGoBack() {
    const can = canGoBack()
    if (typeof previousRoute?.name !== 'undefined' && can) {
      goBack()
    } else if (can && Platform.OS === 'web') {
      window.history.back()
    } else {
      // TypeScript cannot verify that our union type matches navigate's overloaded signature
      // but the types are structurally correct - we're using the same conditional type pattern
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      popTo(navigateParams[0] as any, navigateParams[1])
    }
  }

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

  return { goBack: customGoBack, canGoBack: customCanGoBack }
}
