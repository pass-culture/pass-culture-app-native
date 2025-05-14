import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfo = (): UseQueryResult<SubscriptionStepperResponseV2, unknown> => {
  const { isLoggedIn } = useAuthContext()

  return useQuery<SubscriptionStepperResponseV2>(
    [QueryKeys.STEPPER_INFO],
    () => api.getNativeV2SubscriptionStepper(),
    { enabled: isLoggedIn }
  )
}
