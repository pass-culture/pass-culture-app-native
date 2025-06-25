import {
  CheatcodesStackParamList,
  CheatcodesStackRouteName,
} from 'features/navigation/CheatcodesStackNavigator/CheatcodesStackTypes'

export function getCheatcodesNavConfig<Screen extends CheatcodesStackRouteName>(
  screen: Screen,
  params?: CheatcodesStackParamList[Screen]
): {
  screen: 'CheatcodesStackNavigator'
  params?: {
    screen: Screen
    params?: CheatcodesStackParamList[Screen]
  }
} {
  return {
    screen: 'CheatcodesStackNavigator',
    params: { screen, params },
  }
}
