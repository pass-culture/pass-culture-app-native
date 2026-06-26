import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionStatusQuery = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_STATUS],
    queryFn: () => api.getNativeV1AccountSuspensionStatus(),
    enabled: isLoggedIn,
    meta: { private: true },
  })
}
