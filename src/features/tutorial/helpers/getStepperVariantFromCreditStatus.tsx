import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { CreditStatus } from 'features/tutorial/types'

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
