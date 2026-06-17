import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useAvailableReactionQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.AVAILABLE_REACTION],
    queryFn: () => api.getNativeV2ReactionAvailable(),
    enabled: isLoggedIn,
    // Swallow the 401 raised when the account is suspended so the tab badge never crashes
    // the app; other errors keep their default behaviour.
    throwOnError: (error) => !(isApiError(error) && error.statusCode === 401),
  })
}
