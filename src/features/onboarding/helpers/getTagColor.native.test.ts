import { CreditStatus } from 'features/onboarding/enums'
import { getTagColor } from 'features/onboarding/helpers/getTagColor'
import { computedTheme } from 'tests/computedTheme'

describe('getTagColor', () => {
  it('should return white for GONE status', () => {
    expect(getTagColor(computedTheme, CreditStatus.GONE)).toEqual(computedTheme.colors.white)
  })

  it('should return green for ONGOING status', () => {
    expect(getTagColor(computedTheme, CreditStatus.ONGOING)).toEqual(
      computedTheme.colors.greenValid
    )
  })

  it('should return secondary for COMING status', () => {
    expect(getTagColor(computedTheme, CreditStatus.COMING)).toEqual(computedTheme.colors.secondary)
  })
})
