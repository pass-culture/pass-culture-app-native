import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { GetAvailableReactionsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAvailableReactionQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery<GetAvailableReactionsResponse>(
    [QueryKeys.AVAILABLE_REACTION],
    () => api.getNativeV1ReactionAvailable(),
    {
      enabled: isLoggedIn,
    }
  )
}
