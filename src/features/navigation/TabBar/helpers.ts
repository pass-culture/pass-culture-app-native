import { TabRouteName, TabParamList } from './TabStackNavigatorTypes'

export function getShouldDisplayTab({
  isLoggedIn,
  isBeneficiary,
}: {
  isLoggedIn: boolean
  isBeneficiary: boolean
}) {
  return function (name: TabRouteName): boolean {
    if (name.startsWith('Bookings') && (!isLoggedIn || !isBeneficiary)) {
      return false
    }
    return true
  }
}

export function getTabHookConfig<Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] {
  return ['TabNavigator', { screen, params }]
}

export const homeNavigationConfig = getTabHookConfig('Home')
