import { useAuthContext } from 'features/auth/context/AuthContext'

import { isUserUnderage } from './isUserUnderage'

export const useIsUserUnderage = () => {
  const { user } = useAuthContext()
  return isUserUnderage(user)
}
