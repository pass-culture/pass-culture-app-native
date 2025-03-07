import { AllNavParamList, isScreen } from 'features/navigation/RootNavigator/types'

import { linking } from './index'

type NavigationState = Parameters<typeof linking.getPathFromState>[0]

export function getScreenPath<RouteName extends keyof AllNavParamList>(
  screen: RouteName,
  params: AllNavParamList[RouteName]
) {
  let state: NavigationState = { routes: [{ name: screen, params }] }
  if (isScreen('TabNavigator', screen, params)) {
    const { screen: tabNavigatorScreen, params: tabNavigatorParams } = params
    const nestedRoutes = [{ name: tabNavigatorScreen, params: tabNavigatorParams }]
    state = { routes: [{ name: screen, state: { routes: nestedRoutes } }] }

    if (
      isScreen('SearchStackNavigator', tabNavigatorScreen, tabNavigatorParams) &&
      tabNavigatorParams
    ) {
      const { screen: searchStackScreen, params: searchStackParams } = tabNavigatorParams
      const nestedNestedRoutes = [{ name: searchStackScreen, params: searchStackParams }]
      state = {
        routes: [
          {
            name: screen,
            state: { routes: [{ name: params.screen, state: { routes: nestedNestedRoutes } }] },
          },
        ],
      }
    }
    if (isScreen('ProfileStackNavigator', tabNavigatorScreen, tabNavigatorParams)) {
      const nestedNestedRoutes = [
        {
          name: tabNavigatorParams ? tabNavigatorParams.screen : tabNavigatorScreen,
          params: tabNavigatorParams?.params,
        },
      ]
      state = {
        routes: [
          {
            name: screen,
            state: { routes: [{ name: params.screen, state: { routes: nestedNestedRoutes } }] },
          },
        ],
      }
    }
  }

  return linking.getPathFromState(state, linking.config)
}
