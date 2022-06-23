import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'

export const useCheckHasCurrentEmailChange = () => {
  const netInfo = useNetInfo()

  const { data: currentEmailChangeTimestampResponse } = useQuery(
    QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP,
    () => api.getnativev1profiletokenExpiration(),
    { enabled: !!netInfo.isConnected }
  )
  const hasCurrentEmailChange = !!currentEmailChangeTimestampResponse?.expiration
  return { hasCurrentEmailChange }
}
