import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function usePhoneValidationRemainingAttemptsQuery() {
  const { data: phoneValidationRemainingAttempts } = useQuery(
    [QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS],
    () => api.getNativeV1PhoneValidationRemainingAttempts()
  )
  const isLastAttempt = phoneValidationRemainingAttempts?.remainingAttempts === 1
  return { ...phoneValidationRemainingAttempts, isLastAttempt }
}
