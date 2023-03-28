import {
  DeprecatedIdentityCheckStep,
  DeprecatedStepConfig,
  StepButtonState,
  StepDetails,
  IdentityCheckStep,
} from 'features/identityCheck/types'

export const getStepState = (
  steps: DeprecatedStepConfig[] | StepDetails[],
  step: DeprecatedIdentityCheckStep | IdentityCheckStep,
  currentStep: DeprecatedIdentityCheckStep | IdentityCheckStep | null
): StepButtonState => {
  if (!currentStep) return StepButtonState.DISABLED
  if (currentStep === DeprecatedIdentityCheckStep.END) return StepButtonState.COMPLETED

  const stepIndex = steps.map(({ name }) => name).indexOf(step)
  const currentStepIndex = steps.map(({ name }) => name).indexOf(currentStep)

  if (stepIndex < currentStepIndex) return StepButtonState.COMPLETED
  if (stepIndex === currentStepIndex) return StepButtonState.CURRENT
  return StepButtonState.DISABLED
}
