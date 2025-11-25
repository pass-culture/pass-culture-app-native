import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'

import { getTabHookConfig } from './getTabHookConfig'

export function getShouldDisplayTab({
  isLoggedIn,
  isBeneficiary,
}: {
  isLoggedIn: boolean
  isBeneficiary: boolean
}) {
  return function (name: TabScreens): boolean {
    if (name.startsWith('Bookings') && (!isLoggedIn || !isBeneficiary)) {
      return false
    }
    return true
  }
}

export const homeNavigationConfig = getTabHookConfig('Home')
