import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'

import { TabParamList } from '../navigators/TabNavigator/types'

export const getTabHookConfig = <Screen extends TabScreens>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] => [
  'TabNavigator',
  { screen, params },
]
