import { StepButtonState } from 'features/identityCheck/atoms/StepButton'
import { IdentityCheckStep } from 'features/identityCheck/types'

export const getStepState = (
  step: IdentityCheckStep,
  contextStep: IdentityCheckStep | null
): StepButtonState => {
  if (contextStep === null) {
    return step === IdentityCheckStep.PROFILE ? 'current' : 'disabled'
  }
  if (contextStep === IdentityCheckStep.PROFILE) {
    return step === IdentityCheckStep.IDENTIFICATION ? 'current' : 'disabled'
  }
  if (contextStep === IdentityCheckStep.IDENTIFICATION) {
    return step === IdentityCheckStep.CONFIRMATION ? 'current' : 'disabled'
  }
  return 'completed'
}
