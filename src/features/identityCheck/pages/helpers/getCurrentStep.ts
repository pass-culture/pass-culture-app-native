import { DeprecatedStepConfig, StepDetails } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

export const deprecatedGetCurrentStep = (
  steps: DeprecatedStepConfig[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.screens.includes(currentRoute)) || null

export const getCurrentStep = (
  steps: StepDetails[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.screens.includes(currentRoute)) || null
