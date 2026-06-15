import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAvailableReactionQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.AVAILABLE_REACTION],
    queryFn: () => api.getNativeV2ReactionAvailable(),
    enabled: isLoggedIn,
    // A tab badge must never crash the app: the endpoint returns 401 when the
    // account is suspended while the app still holds valid tokens (e.g. right
    // after an account deletion or when reconnecting to a suspended account).
    throwOnError: false,
  })
}
