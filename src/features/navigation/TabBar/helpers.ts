import { getTabHookConfig } from './getTabHookConfig'
import { TabRouteName } from './TabStackNavigatorTypes'

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

export const homeNavigationConfig = getTabHookConfig('Home')
