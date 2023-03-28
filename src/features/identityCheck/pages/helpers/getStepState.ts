import {
  DeprecatedIdentityCheckStep,
  StepConfig,
  StepButtonState,
  StepDetails,
  IdentityCheckStepNewStepper,
} from 'features/identityCheck/types'

export const getStepState = (
  steps: StepConfig[] | StepDetails[],
  step: DeprecatedIdentityCheckStep | IdentityCheckStepNewStepper,
  currentStep: DeprecatedIdentityCheckStep | IdentityCheckStepNewStepper | null
): StepButtonState => {
  if (!currentStep) return StepButtonState.DISABLED
  if (currentStep === DeprecatedIdentityCheckStep.END) return StepButtonState.COMPLETED

  const stepIndex = steps.map(({ name }) => name).indexOf(step)
  const currentStepIndex = steps.map(({ name }) => name).indexOf(currentStep)

  if (stepIndex < currentStepIndex) return StepButtonState.COMPLETED
  if (stepIndex === currentStepIndex) return StepButtonState.CURRENT
  return StepButtonState.DISABLED
}
