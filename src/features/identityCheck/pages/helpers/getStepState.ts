import { StepButtonState } from 'features/identityCheck/components/StepButton'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'

export const getStepState = (
  steps: StepConfig[],
  step: IdentityCheckStep,
  currentStep: IdentityCheckStep | null
): StepButtonState => {
  if (!currentStep) return 'disabled'
  if (currentStep === IdentityCheckStep.END) return 'completed'

  const stepIndex = steps.map(({ name }) => name).indexOf(step)
  const currentStepIndex = steps.map(({ name }) => name).indexOf(currentStep)

  if (stepIndex < currentStepIndex) return 'completed'
  if (stepIndex === currentStepIndex) return 'current'
  return 'disabled'
}
