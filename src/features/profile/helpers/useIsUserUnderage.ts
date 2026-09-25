import { useAuthContext } from 'features/auth/context/AuthContext'

import { isUserEligibleCreditV2Underage } from './isUserEligibleCreditV2Underage'

export const useIsUserUnderage = () => {
  const { user } = useAuthContext()
  return isUserEligibleCreditV2Underage(user)
}
