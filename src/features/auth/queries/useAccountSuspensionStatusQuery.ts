import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useAccountSuspensionStatusQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPENSION_STATUS],

    queryFn: async () => {
      try {
        return await api.getNativeV1AccountSuspensionStatus()
      } catch {
        return null
      }
    },
  })
}
