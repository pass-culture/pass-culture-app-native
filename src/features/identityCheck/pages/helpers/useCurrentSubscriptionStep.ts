import { useRoute } from '@react-navigation/native'

import { deprecatedGetCurrentStep } from 'features/identityCheck/pages/helpers/getCurrentStep'
import { isSubscriptionRoute } from 'features/identityCheck/pages/helpers/isSubscriptionRoute'
import { useSubscriptionSteps } from 'features/identityCheck/pages/helpers/useSubscriptionSteps'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'

export const useCurrentSubscriptionStep = (): DeprecatedIdentityCheckStep | null => {
  const { name } = useRoute()
  const deprecatedSteps = useSubscriptionSteps()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  const currentStep = currentRoute ? deprecatedGetCurrentStep(deprecatedSteps, currentRoute) : null
  return currentStep ? currentStep.name : null
}
