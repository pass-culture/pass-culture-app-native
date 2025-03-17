import {
  ActivationStackParamList,
  ActivationStackRouteName,
} from 'features/navigation/ActivationStackNavigator/ActivationStackTypes'

export function getActivationNavConfig<Screen extends ActivationStackRouteName>(
  screen: Screen,
  params?: ActivationStackParamList[Screen]
): {
  screen: 'ActivationStackNavigator'
  params?: {
    screen: Screen
    params?: ActivationStackParamList[Screen]
  }
} {
  return {
    screen: 'ActivationStackNavigator',
    params: { screen, params },
  }
}
