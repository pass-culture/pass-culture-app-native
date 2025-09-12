import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const usePhoneValidationRemainingAttemptsQuery = () => {
  const { data: phoneValidationRemainingAttempts } = useQuery({
    queryKey: [QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS],
    queryFn: () => api.getNativeV1PhoneValidationRemainingAttempts(),
  })
  const isLastAttempt = phoneValidationRemainingAttempts?.remainingAttempts === 1
  return { ...phoneValidationRemainingAttempts, isLastAttempt }
}
