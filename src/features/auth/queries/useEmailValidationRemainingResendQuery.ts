import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailValidationRemainingResendsQuery = ({ email }: { email: string }) =>
  useQuery<
    EmailValidationRemainingResendsResponse,
    ApiError,
    EmailValidationRemainingResendsResponse,
    QueryKeys[]
  >({
    queryKey: [QueryKeys.EMAIL_VALIDATION_REMAINING_ATTEMPTS],
    queryFn: () => api.getNativeV1EmailValidationRemainingResendsemail(email),
  })
