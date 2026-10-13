import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponseV3 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfoQuery = (): UseQueryResult<
  SubscriptionStepperResponseV3,
  unknown
> => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.STEPPER_INFO],
    queryFn: () => api.getNativeV3SubscriptionStepper(),
    enabled: isLoggedIn,
    meta: { private: true },
  })
}
