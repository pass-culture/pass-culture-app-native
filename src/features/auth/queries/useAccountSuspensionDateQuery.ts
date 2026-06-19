import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionDateQuery = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_DATE],
    queryFn: async () => {
      try {
        return await api.getNativeV1AccountSuspensionDate()
      } catch {
        return null
      }
    },
    enabled: isLoggedIn,
    meta: { private: true },
  })
}
