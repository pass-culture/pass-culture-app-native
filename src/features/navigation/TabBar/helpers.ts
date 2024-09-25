import { TabRouteName, TabParamList } from './types'

export function getShouldDisplayTab({ isLoggedIn }: { isLoggedIn: string }) {
  return function (name: TabRouteName): boolean {
    if (name.startsWith('Bookings') && !isLoggedIn) {
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
