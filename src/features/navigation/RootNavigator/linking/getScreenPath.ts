import { AllNavParamList, isScreen } from 'features/navigation/RootNavigator/types'

import { linking } from './index'

type NavigationState = Parameters<typeof linking.getPathFromState>[0]

export function getScreenPath<RouteName extends keyof AllNavParamList>(
  screen: RouteName,
  params: AllNavParamList[RouteName]
) {
  let state: NavigationState = { routes: [{ name: screen, params }] }
  if (isScreen('TabNavigator', screen, params)) {
    const { screen: nestedScreen, params: nestedParams } = params
    const nestedRoutes = [{ name: nestedScreen, params: nestedParams }]
    state = { routes: [{ name: screen, state: { routes: nestedRoutes } }] }
    // console.log(JSON.stringify(state, null, 2))

    if (isScreen('SearchStackNavigator', nestedScreen, nestedParams) && nestedParams) {
      const { screen: searchStackScreen, params: searchStackParams } = nestedParams
      const nestedRoutes = [{ name: searchStackScreen, params: searchStackParams }]
      state = {
        routes: [
          {
            name: screen,
            state: { routes: [{ name: params.screen, state: { routes: nestedRoutes } }] },
          },
        ],
      }
    }
  }
  if (isScreen('ProfileStackNavigator', screen, params)) {
    state = {
      routes: [
        {
          name: 'ProfileStackNavigator',
          state: {
            routes: [
              {
                name: params?.screen ?? '',
              },
            ],
          },
        },
      ],
    }
  }
  if (isScreen('OnboardingStackNavigator', screen, params)) {
    state = {
      routes: [
        {
          name: 'OnboardingStackNavigator',
          state: {
            routes: [
              {
                name: params?.screen ?? '',
              },
            ],
          },
        },
      ],
    }
  }

  return linking.getPathFromState(state, linking.config)
}
