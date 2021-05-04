import { useNavigation } from '@react-navigation/native'

import { usePreviousRoute } from './helpers'

export function useBackNavigation(fallbackNavigation?: () => void) {
  const { canGoBack, goBack, navigate } = useNavigation()
  const previousRoute = usePreviousRoute()

  return () => {
    if (typeof previousRoute?.name !== 'undefined' && canGoBack()) {
      goBack()
    } else {
      if (fallbackNavigation) {
        fallbackNavigation()
      } else {
        navigate('Home')
      }
    }
  }
}
