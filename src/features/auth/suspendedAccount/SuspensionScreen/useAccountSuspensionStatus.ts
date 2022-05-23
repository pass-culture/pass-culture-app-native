import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionStatus() {
  return useQuery(QueryKeys.ACCOUNT_SUSPENSION_STATUS, async () => {
    try {
      return await api.getnativev1accountsuspensionStatus()
    } catch {
      return undefined
    }
  })
}
