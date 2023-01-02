import { useAuthContext } from 'features/auth/AuthContext'

import { isUserUnderageBeneficiary } from './isUserUnderageBeneficiary'

export const useIsUserUnderageBeneficiary = () => {
  const { user } = useAuthContext()
  return isUserUnderageBeneficiary(user)
}
