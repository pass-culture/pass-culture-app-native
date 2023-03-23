import {
  IdentityCheckStep,
  StepConfig,
  StepButtonState,
  StepDetails,
  IdentityCheckStepNewStepper,
} from 'features/identityCheck/types'

export const getStepState = (
  steps: StepConfig[] | StepDetails[],
  step: IdentityCheckStep | IdentityCheckStepNewStepper,
  currentStep: IdentityCheckStep | IdentityCheckStepNewStepper | null
): StepButtonState => {
  if (!currentStep) return StepButtonState.DISABLED
  if (currentStep === IdentityCheckStep.END) return StepButtonState.COMPLETED

  const stepIndex = steps.map(({ name }) => name).indexOf(step)
  const currentStepIndex = steps.map(({ name }) => name).indexOf(currentStep)

  if (stepIndex < currentStepIndex) return StepButtonState.COMPLETED
  if (stepIndex === currentStepIndex) return StepButtonState.CURRENT
  return StepButtonState.DISABLED
}
