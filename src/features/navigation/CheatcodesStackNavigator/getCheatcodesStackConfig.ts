import {
  CheatcodesStackParamList,
  CheatcodesStackRouteName,
} from 'features/navigation/CheatcodesStackNavigator/CheatcodesStackTypes'

export function getCheatcodesStackConfig<Screen extends CheatcodesStackRouteName>(
  screen: Screen,
  params?: CheatcodesStackParamList[Screen]
): [
  'CheatcodesStackNavigator',
  {
    screen: Screen
    params: CheatcodesStackParamList[Screen]
  },
] {
  return ['CheatcodesStackNavigator', { screen, params }]
}
