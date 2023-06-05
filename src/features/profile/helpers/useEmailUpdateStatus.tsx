import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  const { data, isLoading } = useQuery(
    [QueryKeys.EMAIL_UPDATE_STATUS],
    () => api.getnativev1profileemailUpdatestatus(),
    { enabled: !!netInfo.isConnected && isLoggedIn }
  )

  return { data, isLoading }
}
