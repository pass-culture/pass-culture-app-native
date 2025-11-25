import {
  CheatcodesStackParamList,
  CheatcodesStackRouteName,
} from 'features/navigation/navigators/CheatcodesStackNavigator/types'

export const getCheatcodesHookConfig = <Screen extends CheatcodesStackRouteName>(
  screen: Screen,
  params?: CheatcodesStackParamList[Screen]
): [
  'CheatcodesStackNavigator',
  {
    screen: Screen
    params: CheatcodesStackParamList[Screen]
  },
] => {
  return ['CheatcodesStackNavigator', { screen, params }]
}
