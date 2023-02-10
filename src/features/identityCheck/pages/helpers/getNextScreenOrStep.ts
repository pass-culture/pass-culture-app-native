import { getCurrentStep } from 'features/identityCheck/pages/helpers/getCurrentStep'
import {
  IdentityCheckStep,
  NextScreenOrStep,
  StepConfig,
  SubscriptionScreen,
} from 'features/identityCheck/types'

export const getNextScreenOrStep = (
  steps: StepConfig[],
  currentRoute: SubscriptionScreen | null
): NextScreenOrStep => {
  if (!currentRoute) return null
  const currentStep = getCurrentStep(steps, currentRoute)
  if (!currentStep) return null

  // Step is not completed
  const currentScreenIndex = currentStep.screens.indexOf(currentRoute)
  const isLastScreen = currentScreenIndex === currentStep.screens.length - 1
  if (!isLastScreen) return { screen: currentStep.screens[currentScreenIndex + 1] }

  // Step is completed => find next step
  const currentStepIndex = steps.indexOf(currentStep)
  const isLastStep = currentStepIndex === steps.length - 1
  if (!isLastStep) return { step: steps[currentStepIndex + 1].name }

  // Step is complete and is last step
  return { step: IdentityCheckStep.END }
}
