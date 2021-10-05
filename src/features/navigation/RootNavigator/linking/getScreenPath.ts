import { AllNavParamList } from 'features/navigation/RootNavigator'

import { linking } from './index'

type NavigationState = Parameters<typeof linking.getPathFromState>[0]

export function getScreenPath<RouteName extends keyof AllNavParamList>(
  screen: RouteName,
  params: AllNavParamList[RouteName]
) {
  let state: NavigationState = { routes: [{ name: screen, params }] }
  if (screen === 'TabNavigator') {
    const nestedRoute = params as AllNavParamList['TabNavigator']
    const nestedRoutes = [{ name: nestedRoute.screen, params: nestedRoute.params }]
    state = { routes: [{ name: screen, state: { routes: nestedRoutes } }] }
  }
  return linking.getPathFromState(state, linking.config)
}
