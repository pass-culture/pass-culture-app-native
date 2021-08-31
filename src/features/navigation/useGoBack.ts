import { useNavigation } from '@react-navigation/native'

import { AllNavParamList, UseNavigationType } from 'features/navigation/RootNavigator'

import { usePreviousRoute } from './helpers'

/**
 * Go back to the previous route in history,
 * or go back to some specified route if no previous route exists.
 *
 * @param name Name of the route to go back to if no previous route exists.
 * @param [params] Params object for the route.
 */
export function useGoBack<RouteName extends keyof AllNavParamList>(
  ...args: undefined extends AllNavParamList[RouteName]
    ? [RouteName] | [RouteName, AllNavParamList[RouteName]]
    : [RouteName, AllNavParamList[RouteName]]
) {
  const { canGoBack, goBack, navigate } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()

  function customGoBack() {
    if (typeof previousRoute?.name !== 'undefined' && canGoBack()) {
      goBack()
    } else {
      navigate(...args)
    }
  }

  return { goBack: customGoBack, canGoBack }
}
