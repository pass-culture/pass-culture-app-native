import { useRoute } from '@react-navigation/native'

import { getCurrentStep } from 'features/identityCheck/pages/helpers/getCurrentStep'
import { isSubscriptionRoute } from 'features/identityCheck/pages/helpers/isSubscriptionRoute'
import { useSubscriptionSteps } from 'features/identityCheck/pages/helpers/useSubscriptionSteps'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'

export const useCurrentSubscriptionStep = (): DeprecatedIdentityCheckStep | null => {
  const { name } = useRoute()
  const steps = useSubscriptionSteps()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  const currentStep = currentRoute ? getCurrentStep(steps, currentRoute) : null
  return currentStep ? currentStep.name : null
}
