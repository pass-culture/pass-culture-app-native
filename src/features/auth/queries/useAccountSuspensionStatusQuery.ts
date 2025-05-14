import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionStatusQuery() {
  return useQuery([QueryKeys.ACCOUNT_SUSPENSION_STATUS], async () => {
    try {
      return await api.getNativeV1AccountSuspensionStatus()
    } catch {
      return null
    }
  })
}
