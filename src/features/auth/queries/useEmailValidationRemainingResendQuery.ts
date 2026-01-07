import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailValidationRemainingResendsQuery = (
  { email }: { email: string },
  options?: { enabled?: boolean }
) => {
  return useQuery<
    EmailValidationRemainingResendsResponse,
    ApiError,
    EmailValidationRemainingResendsResponse,
    [QueryKeys.EMAIL_VALIDATION_REMAINING_ATTEMPTS, string]
  >({
    queryKey: [QueryKeys.EMAIL_VALIDATION_REMAINING_ATTEMPTS, email],
    queryFn: () => api.getNativeV1EmailValidationRemainingResendsemail(email),
    enabled: options?.enabled ?? true,
  })
}
