import { useNavigation } from '@react-navigation/native'
import { Platform } from 'react-native'

import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'

import { usePreviousRoute } from './helpers'

/**
 * Go back to the previous route in history,
 * or go back to some specified route if no previous route exists.
 *
 * @param name Name of the route to go back to if no previous route exists.
 * @param [params] Params object for the route.
 */
export function useGoBack<ScreenName extends keyof RootStackParamList>(
  screen: ScreenName,
  params: RootStackParamList[ScreenName]
) {
  const { canGoBack, goBack, navigate } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()

  function customGoBack() {
    const can = canGoBack()
    if (typeof previousRoute?.name !== 'undefined' && can) {
      goBack()
    } else if (can && Platform.OS === 'web') {
      window.history.back()
    } else {
      navigate(screen, params)
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
