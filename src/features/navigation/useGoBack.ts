import { useNavigation } from '@react-navigation/native'
import { Platform } from 'react-native'

import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { RootNavigateParams, UseNavigationType } from 'features/navigation/RootNavigator/types'

/**
 * Go back to the previous route in history,
 * or go back to some specified route if no previous route exists.
 *
 * @param ...navigateParams - Same parameters as navigate(...) function.
 */
export function useGoBack(...navigateParams: RootNavigateParams) {
  const { canGoBack, goBack, navigate } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()

  function customGoBack() {
    const can = canGoBack()
    if (typeof previousRoute?.name !== 'undefined' && can) {
      goBack()
    } else if (can && Platform.OS === 'web') {
      window.history.back()
    } else {
      navigate(...navigateParams)
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
