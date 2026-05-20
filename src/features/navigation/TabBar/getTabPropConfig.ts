import { TabParamList } from 'features/navigation/navigators/TabNavigator/types'
import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'

export const getTabPropConfig = <Screen extends TabScreens>(
  screen: Screen,
  params?: TabParamList[Screen]
): {
  screen: 'TabNavigator'
  params: { screen: Screen; params?: TabParamList[Screen] }
} => {
  return { screen: 'TabNavigator', params: { screen, params } }
}
