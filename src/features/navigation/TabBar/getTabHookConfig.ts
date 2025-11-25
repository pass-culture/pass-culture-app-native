import { TabRouteName, TabParamList } from './TabStackNavigatorTypes'

export const getTabHookConfig = <Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] => [
  'TabNavigator',
  { screen, params },
]
