import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionCapturedAsInfo, isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { eventMonitoring } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export async function getEmailUpdateStatus({ logType }: { logType: LogTypeEnum }) {
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
    if (isAPIExceptionCapturedAsInfo(error?.statusCode) && logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(error?.message, { level: logType })
    }
    return
  }
}

export const useEmailUpdateStatus = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery([QueryKeys.EMAIL_UPDATE_STATUS], () => getEmailUpdateStatus({ logType }), {
    enabled: !!netInfo.isConnected && isLoggedIn,
  })
}
