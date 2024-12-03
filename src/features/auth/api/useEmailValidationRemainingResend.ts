import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailValidationRemainingResends = ({
  email,
  onError,
}: {
  email: string
  onError: (err: ApiError) => void
}) => {
  const netInfo = useNetInfoContext()

  return useQuery(
    [QueryKeys.EMAIL_VALIDATION_REMAINING_ATTEMPTS],
    () => api.getNativeV1EmailValidationRemainingResendsemail(email),
    {
      onError,
      enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    }
  )
}
