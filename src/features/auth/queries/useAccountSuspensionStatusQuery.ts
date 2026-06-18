import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionStatusQuery = (enabled?: boolean) =>
  useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_STATUS],
    queryFn: async () => {
      try {
        return await api.getNativeV1AccountSuspensionStatus()
      } catch {
        return null
      }
    },
    enabled: enabled ?? false,
    meta: { private: true },
  })
