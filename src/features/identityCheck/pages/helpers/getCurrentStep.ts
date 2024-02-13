import { IdentityCheckStep } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { StepDetails } from 'ui/components/StepButton/types'

export const getCurrentStep = (
  steps: StepDetails<IdentityCheckStep>[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.firstScreen === currentRoute) ?? null
