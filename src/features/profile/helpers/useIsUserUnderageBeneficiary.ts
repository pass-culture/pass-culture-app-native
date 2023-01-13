import { useAuthContext } from 'features/auth/context/AuthContext'

import { isUserUnderageBeneficiary } from './isUserUnderageBeneficiary'

export const useIsUserUnderageBeneficiary = () => {
  const { user } = useAuthContext()
  return isUserUnderageBeneficiary(user)
}
