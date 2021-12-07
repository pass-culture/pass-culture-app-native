import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useCheckHasCurrentEmailChange = () => {
  const { data: currentEmailChangeTimestampResponse } = useQuery(
    QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP,
    () => api.getnativev1profiletokenExpiration()
  )
  const hasCurrentEmailChange = !!currentEmailChangeTimestampResponse?.expiration
  return { hasCurrentEmailChange }
}
