import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailValidationRemainingResends = ({
  email,
  onError,
}: {
  email: string
  onError: (err: ApiError) => void
}) => {
  return useQuery(
    [QueryKeys.EMAIL_VALIDATION_REMAINING_ATTEMPTS],
    () => api.getNativeV1EmailValidationRemainingResendsemail(email),
    {
      onError,
    }
  )
}
