import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionDateQuery = () =>
  useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_DATE],
    queryFn: async () => {
      try {
        return await api.getNativeV1AccountSuspensionDate()
      } catch {
        return null
      }
    },
  })
