import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfo = (): {
  stepToDisplay: SubscriptionStepperResponse['subscriptionStepsToDisplay']
} => {
  const { data } = useQuery(QueryKeys.STEPPER_INFO, () => api.getnativev1subscriptionstepper())
  if (data?.subscriptionStepsToDisplay === undefined) {
    return { stepToDisplay: [] }
  }

  return { stepToDisplay: data?.subscriptionStepsToDisplay }
}
