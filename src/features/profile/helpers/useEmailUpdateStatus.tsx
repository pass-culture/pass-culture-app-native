import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError, isAPIExceptionCapturedAsInfo } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export async function getEmailUpdateStatus() {
  try {
    return await api.getnativev1profileemailUpdatestatus()
  } catch (err) {
    const error = err as ApiError
    if (error?.statusCode !== 404 && !isAPIExceptionCapturedAsInfo(error?.statusCode)) {
      eventMonitoring.captureException(error)
    }
    return
  }
}

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  const { data, isLoading } = useQuery(
    [QueryKeys.EMAIL_UPDATE_STATUS],
    () => getEmailUpdateStatus(),
    { enabled: !!netInfo.isConnected && isLoggedIn }
  )

  return { data, isLoading }
}
