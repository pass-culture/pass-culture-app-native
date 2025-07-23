import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailValidationRemainingResendsQuery = ({
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
