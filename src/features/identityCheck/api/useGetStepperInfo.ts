import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfo = (): {
  stepToDisplay: SubscriptionStepperResponse['subscriptionStepsToDisplay']
  title: SubscriptionStepperResponse['title']
  subtitle?: SubscriptionStepperResponse['subtitle'] | null
  errorMessage?: SubscriptionStepperResponse['errorMessage'] | null
  identificationMethods?: SubscriptionStepperResponse['allowedIdentityCheckMethods'] | null
} => {
  const { data } = useQuery([QueryKeys.STEPPER_INFO], () => api.getNativeV1SubscriptionStepper())

  return {
    stepToDisplay: data?.subscriptionStepsToDisplay || [],
    title: data?.title || '',
    subtitle: data?.subtitle,
    errorMessage: data?.errorMessage,
    identificationMethods: data?.allowedIdentityCheckMethods,
  }
}
