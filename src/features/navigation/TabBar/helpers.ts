import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'

import { TabRoute, TabRouteName, TabParamList, TabNavigateConfig } from './types'

export const shouldDisplayTabIconPredicate = (
  authContext: IAuthContext,
  user?: UserProfileResponse
) => (route: TabRoute): boolean => {
  if (route.name === 'Bookings' && (!authContext.isLoggedIn || !user?.isBeneficiary)) {
    return false
  }
  return true
}

export function getTabNavigateConfig<Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): TabNavigateConfig<Screen> {
  return { screen: 'TabNavigator', params: { screen, params } }
}
