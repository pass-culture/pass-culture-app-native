import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionStatus() {
  const netInfo = useNetInfoContext()

  return useQuery(
    [QueryKeys.ACCOUNT_SUSPENSION_STATUS],
    async () => {
      try {
        return await api.getnativev1accountsuspensionStatus()
      } catch {
        return undefined
      }
    },
    { enabled: !!netInfo.isConnected }
  )
}
