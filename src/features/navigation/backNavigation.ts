import { useNavigation } from '@react-navigation/native'

import { navigateToHome, usePreviousRoute } from './helpers'

export function useBackNavigation(fallbackNavigation?: () => void) {
  const { canGoBack, goBack } = useNavigation()
  const previousRoute = usePreviousRoute()

  return () => {
    if (typeof previousRoute?.name !== 'undefined' && canGoBack()) {
      goBack()
    } else {
      if (fallbackNavigation) {
        fallbackNavigation()
      } else {
        navigateToHome()
      }
    }
  }
}
