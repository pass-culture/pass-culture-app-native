import { StepConfig } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

export const getCurrentStep = (
  steps: StepConfig[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.screens.includes(currentRoute)) || null
