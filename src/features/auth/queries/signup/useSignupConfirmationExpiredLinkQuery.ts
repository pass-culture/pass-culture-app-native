import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { analytics } from 'libs/analytics/provider'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

export const useSignupConfirmationExpiredLinkQuery = (email: string, onSuccess: () => void) => {
  const signupConfirmationExpiredLink = async () => {
    try {
      await analytics.logResendEmailSignupConfirmationExpiredLink()
      const result = await api.postNativeV1ResendEmailValidation({ email })
      onSuccess()
      return result
    } catch (err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', {
        retry: query.refetch,
        logType: LogTypeEnum.ERROR,
      })
    }
  }

  const query = useQuery({
    queryKey: [QueryKeys.SIGNUP_CONFIRMATION_EXPIRED_LINK],
    queryFn: signupConfirmationExpiredLink,
    gcTime: 0,
    enabled: false,
  })

  return query
}
