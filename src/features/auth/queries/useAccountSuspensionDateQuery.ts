import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionDateQuery() {
  return useQuery([QueryKeys.ACCOUNT_SUSPENSION_DATE], async () => {
    try {
      return await api.getNativeV1AccountSuspensionDate()
    } catch {
      return null
    }
  })
}
