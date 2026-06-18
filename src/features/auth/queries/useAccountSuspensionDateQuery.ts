import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionDateQuery = (enabled?: boolean) =>
  useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_DATE],
    queryFn: async () => {
      try {
        return await api.getNativeV1AccountSuspensionDate()
      } catch {
        return null
      }
    },
    enabled: enabled ?? false,
    meta: { private: true },
  })
