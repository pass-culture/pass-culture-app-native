import { TabRouteName, TabParamList } from './types'

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

export function getTabNavConfig<Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] {
  return ['TabNavigator', { screen, params }]
}

export const homeNavConfig = getTabNavConfig('Home')
