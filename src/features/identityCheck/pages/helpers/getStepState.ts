import { StepButtonState } from 'features/identityCheck/types'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'

export const getStepState = (
  steps: StepConfig[],
  step: IdentityCheckStep,
  currentStep: IdentityCheckStep | null
): StepButtonState => {
  if (!currentStep) return StepButtonState.DISABLED
  if (currentStep === IdentityCheckStep.END) return StepButtonState.COMPLETED

  const stepIndex = steps.map(({ name }) => name).indexOf(step)
  const currentStepIndex = steps.map(({ name }) => name).indexOf(currentStep)

  if (stepIndex < currentStepIndex) return StepButtonState.COMPLETED
  if (stepIndex === currentStepIndex) return StepButtonState.CURRENT
  return StepButtonState.DISABLED
}
