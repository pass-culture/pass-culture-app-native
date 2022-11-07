import { AllNavParamList, isScreen } from 'features/navigation/RootNavigator/types'

import { linking } from './index'

type NavigationState = Parameters<typeof linking.getPathFromState>[0]

export function getScreenPath<RouteName extends keyof AllNavParamList>(
  screen: RouteName,
  params: AllNavParamList[RouteName]
) {
  let state: NavigationState = { routes: [{ name: screen, params }] }
  if (isScreen('TabNavigator', screen, params)) {
    const nestedRoutes = [{ name: params.screen, params: params.params }]
    state = { routes: [{ name: screen, state: { routes: nestedRoutes } }] }
  }
  return linking.getPathFromState(state, linking.config)
}
