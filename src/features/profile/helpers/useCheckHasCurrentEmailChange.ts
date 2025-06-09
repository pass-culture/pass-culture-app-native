import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useCheckHasCurrentEmailChange = () => {
  const { data: currentEmailChangeTimestampResponse } = useQuery(
    [QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP],
    () => api.getNativeV1ProfileTokenExpiration()
  )
  const hasCurrentEmailChange = !!currentEmailChangeTimestampResponse?.expiration
  return { hasCurrentEmailChange }
}
