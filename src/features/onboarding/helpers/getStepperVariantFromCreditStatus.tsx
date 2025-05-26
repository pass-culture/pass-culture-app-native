import { CreditStatus } from 'features/onboarding/enums'
import { StepVariant } from 'ui/components/VerticalStepper/types'

export const getStepperVariantFromCreditStatus = (creditStatus: CreditStatus): StepVariant => {
  switch (creditStatus) {
    case CreditStatus.GONE:
      return StepVariant.complete
    case CreditStatus.ONGOING:
      return StepVariant.in_progress
    case CreditStatus.COMING:
      return StepVariant.future
  }
}
