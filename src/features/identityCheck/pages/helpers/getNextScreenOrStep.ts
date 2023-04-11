import {
  deprecatedGetCurrentStep,
  getCurrentStep,
} from 'features/identityCheck/pages/helpers/getCurrentStep'
import {
  DeprecatedIdentityCheckStep,
  NextScreenOrStep,
  DeprecatedStepConfig,
  SubscriptionScreen,
  StepDetails,
} from 'features/identityCheck/types'

export const deprecatedGetNextScreenOrStep = (
  steps: DeprecatedStepConfig[],
  currentRoute: SubscriptionScreen | null
): NextScreenOrStep => {
  if (!currentRoute) return null
  const currentStep = deprecatedGetCurrentStep(steps, currentRoute)
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
  return { step: DeprecatedIdentityCheckStep.END }
}
export const getNextScreenOrStep = (
  steps: StepDetails[],
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
  return { step: DeprecatedIdentityCheckStep.END }
}
