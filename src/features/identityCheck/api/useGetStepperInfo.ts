import { UseQueryResult, useQuery } from 'react-query'

import { api } from 'api/api'
import { NextSubscriptionStepResponse, SubscriptionStepperResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export type SubscriptionStepperResponseV2 = SubscriptionStepperResponse & {
  nextSubscriptionStep?: NextSubscriptionStepResponse['nextSubscriptionStep']
  subscriptionMessage?: NextSubscriptionStepResponse['subscriptionMessage']
  hasIdentityCheckPending?: NextSubscriptionStepResponse['hasIdentityCheckPending']
}

export const useGetStepperInfo = (): UseQueryResult<SubscriptionStepperResponseV2, unknown> => {
  const query = useQuery<SubscriptionStepperResponseV2>([QueryKeys.STEPPER_INFO], () =>
    api.getNativeV1SubscriptionStepper()
  )

  return query
}
