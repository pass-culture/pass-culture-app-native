import { useQuery } from 'react-query'

import { api } from 'api/api'
import { NextSubscriptionStepResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export function useNextSubscriptionStep() {
  const { isLoggedIn } = useAuthContext()
  return useQuery<NextSubscriptionStepResponse>(
    QueryKeys.NEXT_SUBSCRIPTION_STEP,
    () => api.getnativev1subscriptionnextStep(),
    { enabled: isLoggedIn }
  )
}
