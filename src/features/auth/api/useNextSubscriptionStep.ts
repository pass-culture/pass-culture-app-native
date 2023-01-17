import { useQuery } from 'react-query'

import { api } from 'api/api'
import { NextSubscriptionStepResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useNextSubscriptionStep(setError?: (error: Error) => void) {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  return useQuery<NextSubscriptionStepResponse | undefined>(
    QueryKeys.NEXT_SUBSCRIPTION_STEP,
    async () => {
      try {
        return await api.getnativev1subscriptionnextStep()
      } catch (e) {
        e instanceof Error && setError && setError(e)
        return
      }
    },
    { enabled: !!netInfo.isConnected && isLoggedIn }
  )
}
