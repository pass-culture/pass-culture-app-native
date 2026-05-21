import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubscriptionStepperResponseV2, SubscriptionStepperResponseV3 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

export const useGetStepperInfoQuery = (): UseQueryResult<
  SubscriptionStepperResponseV2 | SubscriptionStepperResponseV3,
  unknown
> => {
  const { isLoggedIn } = useAuthContext()
  const phoneNumberInProfileStepper = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_PHONE_NUMBER_IN_PROFILE_STEPPER
  )

  return useQuery({
    queryKey: [QueryKeys.STEPPER_INFO, phoneNumberInProfileStepper],
    queryFn: () =>
      phoneNumberInProfileStepper
        ? api.getNativeV3SubscriptionStepper()
        : api.getNativeV2SubscriptionStepper(),
    enabled: isLoggedIn,
  })
}
