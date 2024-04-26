import { UseQueryResult, useQuery } from 'react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponseV2 } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfo = (): UseQueryResult<SubscriptionStepperResponseV2, unknown> => {
  return useQuery<SubscriptionStepperResponseV2>([QueryKeys.STEPPER_INFO], () =>
    api.getNativeV2SubscriptionStepper()
  )
}
