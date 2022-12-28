import { useAuthContext } from 'features/auth/AuthContext'

import { isUserUnderage } from './isUserUnderage'

export const useIsUserUnderage = () => {
  const { user } = useAuthContext()
  return isUserUnderage(user)
}
