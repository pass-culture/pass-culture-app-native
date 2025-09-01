import { TabParamList, TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'

export function getTabPropConfig<Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): {
  screen: 'TabNavigator'
  params: {
    screen: 'TabNavigator'
    params: { screen: Screen; params: TabParamList[Screen] }
  }
} {
  return {
    screen: 'TabNavigator',
    params: { screen: 'TabNavigator', params: { screen, params } },
  }
}
