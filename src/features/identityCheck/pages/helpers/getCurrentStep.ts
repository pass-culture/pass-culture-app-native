import { DeprecatedStepConfig } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

export const deprecatedGetCurrentStep = (
  steps: DeprecatedStepConfig[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.screens.includes(currentRoute)) || null
