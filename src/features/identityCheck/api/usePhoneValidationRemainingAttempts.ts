import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function usePhoneValidationRemainingAttempts() {
  const { data: phoneValidationRemainingAttempts } = useQuery(
    QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS,
    () => api.getnativev1phoneValidationremainingAttempts()
  )
  const isLastAttempt = phoneValidationRemainingAttempts?.remainingAttempts === 1
  return { ...phoneValidationRemainingAttempts, isLastAttempt }
}
