import { StepExtendedDetails } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

export const getCurrentStep = (
  steps: StepExtendedDetails[],
  currentRoute: keyof SubscriptionRootStackParamList
) => steps.find((step) => step.firstScreen === currentRoute) ?? null
