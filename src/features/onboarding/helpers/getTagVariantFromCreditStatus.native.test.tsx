import { CreditStatus } from 'features/onboarding/enums'
import { getTagVariantFromCreditStatus } from 'features/onboarding/helpers/getTagVariantFromCreditStatus'
import { TagVariant } from 'ui/components/Tag/types'

describe('getTagVariantFromCreditStatus', () => {
  it('should return DEFAULT when status is GONE', () => {
    expect(getTagVariantFromCreditStatus(CreditStatus.GONE)).toBe(TagVariant.DEFAULT)
  })

  it('should return SUCCESS when status is ONGOING', () => {
    expect(getTagVariantFromCreditStatus(CreditStatus.ONGOING)).toBe(TagVariant.SUCCESS)
  })

  it('should return WARNING when status is COMING', () => {
    expect(getTagVariantFromCreditStatus(CreditStatus.COMING)).toBe(TagVariant.WARNING)
  })
})
