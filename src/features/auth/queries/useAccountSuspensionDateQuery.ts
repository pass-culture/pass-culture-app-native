import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionDateQuery = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_DATE],
    queryFn: () => api.getNativeV1AccountSuspensionDate(),
    enabled: isLoggedIn,
    meta: { private: true },
  })
}
