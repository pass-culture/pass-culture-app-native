import { useRoute } from '@react-navigation/native'

import { getCurrentStep } from 'features/identityCheck/pages/helpers/getCurrentStep'
import { isSubscriptionRoute } from 'features/identityCheck/pages/helpers/isSubscriptionRoute'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { DeprecatedIdentityCheckStep, IdentityCheckStep } from 'features/identityCheck/types'

export const useCurrentSubscriptionStep = ():
  | DeprecatedIdentityCheckStep
  | IdentityCheckStep
  | null => {
  const { name } = useRoute()
  const { stepsDetails } = useStepperInfo()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  const currentStep = currentRoute ? getCurrentStep(stepsDetails, currentRoute) : null
  return currentStep ? currentStep.name : null
}
