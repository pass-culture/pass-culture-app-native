import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionCapturedAsInfo } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export async function getEmailUpdateStatus() {
  try {
    return await api.getNativeV1ProfileEmailUpdateStatus()
  } catch (err) {
    const error = err as ApiError
    if (error?.statusCode !== 404 && !isAPIExceptionCapturedAsInfo(error?.statusCode)) {
      eventMonitoring.logError(error)
    }
    if (isAPIExceptionCapturedAsInfo(error?.statusCode)) {
      eventMonitoring.logInfo(error?.message)
    }
    return
  }
}

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  return useQuery([QueryKeys.EMAIL_UPDATE_STATUS], getEmailUpdateStatus, {
    enabled: !!netInfo.isConnected && isLoggedIn,
  })
}
