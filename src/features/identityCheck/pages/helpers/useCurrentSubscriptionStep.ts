import { useRoute } from '@react-navigation/native'

import {
  deprecatedGetCurrentStep,
  getCurrentStep,
} from 'features/identityCheck/pages/helpers/getCurrentStep'
import { isSubscriptionRoute } from 'features/identityCheck/pages/helpers/isSubscriptionRoute'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { useSubscriptionSteps } from 'features/identityCheck/pages/helpers/useSubscriptionSteps'
import { DeprecatedIdentityCheckStep, IdentityCheckStep } from 'features/identityCheck/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useCurrentSubscriptionStep = ():
  | DeprecatedIdentityCheckStep
  | IdentityCheckStep
  | null => {
  const { name } = useRoute()
  const deprecatedSteps = useSubscriptionSteps()
  const { stepsDetails } = useStepperInfo()
  const wipStepperRetryUbble = useFeatureFlag(RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE)
  const currentRoute = isSubscriptionRoute(name) ? name : null

  if (wipStepperRetryUbble) {
    const currentStep = currentRoute ? getCurrentStep(stepsDetails, currentRoute) : null
    return currentStep ? currentStep.name : null
  }

  const currentStep = currentRoute ? deprecatedGetCurrentStep(deprecatedSteps, currentRoute) : null
  return currentStep ? currentStep.name : null
}
