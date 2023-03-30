import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountSuspensionDate() {
  const netInfo = useNetInfoContext()
  return useQuery(
    [QueryKeys.ACCOUNT_SUSPENSION_DATE],
    async () => {
      try {
        return await api.getnativev1accountsuspensionDate()
      } catch {
        return null
      }
    },
    { enabled: !!netInfo.isConnected }
  )
}
