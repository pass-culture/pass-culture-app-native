import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfoQuery = (): UseQueryResult<
  SubscriptionStepperResponseV2,
  unknown
> => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.STEPPER_INFO],
    queryFn: () => api.getNativeV2SubscriptionStepper(),
    enabled: isLoggedIn,
  })
}
