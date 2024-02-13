import { IdentityCheckStep, StepDetails } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

export const getCurrentStep = (
  steps: StepDetails<IdentityCheckStep>[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.firstScreen === currentRoute) ?? null
