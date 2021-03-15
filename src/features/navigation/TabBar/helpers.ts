import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'

import { TabRoute } from './types'

export const shouldDisplayTabIconPredicate = (
  authContext: IAuthContext,
  user?: UserProfileResponse
) => (route: TabRoute): boolean => {
  if (route.name === 'Bookings' && (!authContext.isLoggedIn || !user?.isBeneficiary)) {
    return false
  }
  return true
}
