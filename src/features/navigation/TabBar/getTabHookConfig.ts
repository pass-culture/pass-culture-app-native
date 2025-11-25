import { TabRouteName, TabParamList } from '../navigators/TabNavigator/types'

export const getTabHookConfig = <Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] => [
  'TabNavigator',
  { screen, params },
]
