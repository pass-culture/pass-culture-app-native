import { CreditStatus } from 'features/onboarding/enums'
import { TagVariant } from 'ui/designSystem/Tag/types'

const creditStatusToVariant: Record<CreditStatus, TagVariant> = {
  [CreditStatus.GONE]: TagVariant.DEFAULT,
  [CreditStatus.ONGOING]: TagVariant.SUCCESS,
  [CreditStatus.COMING]: TagVariant.WARNING,
}

export const getTagVariantFromCreditStatus = (status: CreditStatus): TagVariant =>
  creditStatusToVariant[status] ?? TagVariant.DEFAULT
