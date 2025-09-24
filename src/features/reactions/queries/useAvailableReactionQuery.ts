import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAvailableReactionQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.AVAILABLE_REACTION],
    queryFn: () => api.getNativeV1ReactionAvailable(),
    enabled: isLoggedIn,
  })
}
