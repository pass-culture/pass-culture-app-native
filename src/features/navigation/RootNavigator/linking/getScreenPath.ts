import { isScreen } from 'features/navigation/RootNavigator/types'

import { linking } from './index'

type NavigationState = Parameters<typeof linking.getPathFromState>[0]

export function getScreenPath(screen, params) {
  let state: NavigationState = { routes: [{ name: screen, params }] }
  if (isScreen('TabNavigator', screen, params) && params?.screen) {
    state = {
      routes: [
        { name: screen, state: { routes: [{ name: params?.screen, params: params?.params }] } },
      ],
    }

    if (
      isScreen('SearchStackNavigator', params?.screen, params?.params) &&
      params?.params &&
      params.params.screen
    ) {
      state = {
        routes: [
          {
            name: screen,
            state: {
              routes: [
                {
                  name: params.screen,
                  state: { routes: [{ name: params.params.screen, params: params.params.params }] },
                },
              ],
            },
          },
        ],
      }
    }
  }
  if (isScreen('ProfileStackNavigator', screen, params) && params?.screen) {
    state = {
      routes: [
        {
          name: 'ProfileStackNavigator',
          state: {
            routes: [
              {
                name: params?.screen,
              },
            ],
          },
        },
      ],
    }
  }
  if (isScreen('OnboardingStackNavigator', screen, params) && params?.screen) {
    state = {
      routes: [
        {
          name: 'OnboardingStackNavigator',
          state: {
            routes: [
              {
                name: params?.screen,
              },
            ],
          },
        },
      ],
    }
  }

  return linking.getPathFromState(state, linking.config)
}
