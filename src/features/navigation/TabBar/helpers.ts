import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'

import { TabRoute } from './types'

export const shouldDisplayTabIconPredicate = (
  authContext: IAuthContext,
  user?: UserProfileResponse
) => (route: TabRoute): boolean => {
  if (
    route.name === 'Bookings' &&
    (!authContext.isLoggedIn || !user?.isBeneficiary || !env.SHOULD_DISPLAY_BOOKINGS_TAB)
  ) {
    return false
  }
  return true
}
