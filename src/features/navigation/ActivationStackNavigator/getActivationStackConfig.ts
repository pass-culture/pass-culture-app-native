import {
  ActivationStackParamList,
  ActivationStackRouteName,
} from 'features/navigation/ActivationStackNavigator/ActivationStackTypes'

export function getActivationStackConfig<Screen extends ActivationStackRouteName>(
  screen: Screen,
  params?: ActivationStackParamList[Screen]
): [
  'ActivationStackNavigator',
  {
    screen: Screen
    params: ActivationStackParamList[Screen]
  },
] {
  return ['ActivationStackNavigator', { screen, params }]
}
