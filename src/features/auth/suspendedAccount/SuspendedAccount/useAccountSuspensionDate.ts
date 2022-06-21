import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionDate() {
  const netInfo = useNetInfo()
  return useQuery(
    QueryKeys.ACCOUNT_SUSPENSION_DATE,
    async () => {
      try {
        return await api.getnativev1accountsuspensionDate()
      } catch {
        return undefined
      }
    },
    { enabled: !!netInfo.isConnected }
  )
}
