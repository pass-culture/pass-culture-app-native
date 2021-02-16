import { useNavigation, useRoute } from '@react-navigation/native'

import { usePreviousRoute } from './helpers'
import {
  AllNavParamList,
  BackNavigationParams,
  ScreenNames,
  UseRouteType,
} from './RootNavigator/types'

/**
 * Type guard to check if the current route define a back navigation parameter
 */
function hasBackNavigationParameter<Screen extends ScreenNames>(
  params: BackNavigationParams<Screen> | Readonly<AllNavParamList[Screen]> | undefined
): params is BackNavigationParams<Screen> {
  return typeof params === 'object' && 'backNavigation' in params
}

export function useBackNavigation<CurrentScreenName extends ScreenNames>(
  fallbackNavigation?: () => void
) {
  const { canGoBack, goBack, navigate } = useNavigation()
  const previousRoute = usePreviousRoute()
  const { params: currentRouteParams } = useRoute<UseRouteType<CurrentScreenName>>()

  return () => {
    if (hasBackNavigationParameter<CurrentScreenName>(currentRouteParams)) {
      const { from, params } = currentRouteParams.backNavigation || {}
      from && navigate(from, params)
    } else {
      if (typeof previousRoute?.name !== 'undefined' && canGoBack()) {
        goBack()
      } else {
        if (fallbackNavigation) {
          fallbackNavigation()
        } else {
          navigate('Home', { shouldDisplayLoginModal: false })
        }
      }
    }
  }
}
