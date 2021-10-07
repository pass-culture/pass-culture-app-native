import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'

import { TabRoute, TabRouteName, TabParamList } from './types'

export const shouldDisplayTabIconPredicate = (
  authContext: IAuthContext,
  user?: UserProfileResponse
) => (route: TabRoute): boolean => {
  if (route.name === 'Bookings' && (!authContext.isLoggedIn || !user?.isBeneficiary)) {
    return false
  }
  return true
}

export function getTabNavConfig<Screen extends TabRouteName>(
  screen: Screen,
  params?: TabParamList[Screen]
): ['TabNavigator', { screen: Screen; params: TabParamList[Screen] }] {
  return ['TabNavigator', { screen, params }]
}
