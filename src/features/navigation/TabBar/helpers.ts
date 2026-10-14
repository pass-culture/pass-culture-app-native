import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'

import { getTabHookConfig } from './getTabHookConfig'

const GENERAL_PUBLIC_TABS: TabScreens[] = ['Home', 'AroundMe', 'Profile']

export const getShouldDisplayTab = ({
  isLoggedIn,
  isBeneficiary,
  shouldDisplayGeneralPublicHome,
}: {
  isLoggedIn: boolean
  isBeneficiary: boolean
  shouldDisplayGeneralPublicHome: boolean
}) => {
  return function (name: TabScreens): boolean {
    if (shouldDisplayGeneralPublicHome) {
      return GENERAL_PUBLIC_TABS.includes(name)
    }
    if (name === 'AroundMe') {
      return false
    }
    if (name.startsWith('Bookings') && (!isLoggedIn || !isBeneficiary)) {
      return false
    }
    return true
  }
}

export const homeNavigationConfig = getTabHookConfig('Home')
