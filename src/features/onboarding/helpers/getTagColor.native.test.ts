import { CreditStatus } from 'features/onboarding/enums'
import { getTagColor } from 'features/onboarding/helpers/getTagColor'
import { computedTheme } from 'tests/computedTheme'

describe('getTagColor', () => {
  it('should return default for undefined status', () => {
    expect(getTagColor(computedTheme, undefined as unknown as CreditStatus)).toEqual(
      computedTheme.designSystem.color.background.default
    )
  })

  it('should return disable for GONE status', () => {
    expect(getTagColor(computedTheme, CreditStatus.GONE)).toEqual(
      computedTheme.designSystem.color.background.disabled
    )
  })

  it('should return success for ONGOING status', () => {
    expect(getTagColor(computedTheme, CreditStatus.ONGOING)).toEqual(
      computedTheme.designSystem.color.background.success
    )
  })

  it('should return secondary for COMING status', () => {
    expect(getTagColor(computedTheme, CreditStatus.COMING)).toEqual(
      computedTheme.designSystem.color.background.lockedBrandSecondary
    )
  })
})
