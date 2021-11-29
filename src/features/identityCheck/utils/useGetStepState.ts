import { StepButtonState } from 'features/identityCheck/atoms/StepButton'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'

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

export const useGetStepState = (): ((step: IdentityCheckStep) => StepButtonState) => {
  const steps = useIdentityCheckSteps()
  const { step: currentStep } = useIdentityCheckContext()

  return (step: IdentityCheckStep) => getStepState(steps, step, currentStep)
}
