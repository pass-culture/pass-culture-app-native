import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useCheckHasCurrentEmailChangeQuery = () => {
  const { data: currentEmailChangeTimestampResponse } = useQuery({
    queryKey: [QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP],
    queryFn: () => api.getNativeV1ProfileTokenExpiration(),
  })
  const hasCurrentEmailChange = !!currentEmailChangeTimestampResponse?.expiration
  return { hasCurrentEmailChange }
}
