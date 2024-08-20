import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  return useQuery(
    [QueryKeys.EMAIL_UPDATE_STATUS_V2],
    () => api.getNativeV2ProfileEmailUpdateStatus(),
    {
      enabled: !!netInfo.isConnected && isLoggedIn,
    }
  )
}
