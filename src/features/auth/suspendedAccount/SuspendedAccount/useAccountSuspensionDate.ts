import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionDate() {
  return useQuery(QueryKeys.ACCOUNT_SUSPENSION_DATE, async () => {
    try {
      return await api.getnativev1accountsuspensionDate()
    } catch {
      return undefined
    }
  })
}
