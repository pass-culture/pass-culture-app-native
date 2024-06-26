import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionCapturedAsInfo, isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export async function getEmailUpdateStatus({ shouldLogInfo }: { shouldLogInfo: boolean }) {
  try {
    return await api.getNativeV1ProfileEmailUpdateStatus()
  } catch (err) {
    const error = err as ApiError
    if (
      error?.statusCode !== 404 &&
      !isAPIExceptionCapturedAsInfo(error?.statusCode) &&
      !isAPIExceptionNotCaptured(error?.statusCode)
    ) {
      eventMonitoring.captureException(error)
    }
    if (isAPIExceptionCapturedAsInfo(error?.statusCode) && shouldLogInfo) {
      eventMonitoring.captureException(error?.message, { level: 'info' })
    }
    return
  }
}

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()
  const { shouldLogInfo } = useRemoteConfigContext()

  return useQuery([QueryKeys.EMAIL_UPDATE_STATUS], () => getEmailUpdateStatus({ shouldLogInfo }), {
    enabled: !!netInfo.isConnected && isLoggedIn,
  })
}
