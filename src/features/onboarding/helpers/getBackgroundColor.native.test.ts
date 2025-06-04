import { CreditStatus } from 'features/onboarding/enums'
import { getBackgroundColor } from 'features/onboarding/helpers/getBackgroundColor'
import { computedTheme } from 'tests/computedTheme'

describe('getBackgroundColor', () => {
  it.each`
    status                  | expectedBackgroundColor
    ${CreditStatus.GONE}    | ${computedTheme.designSystem.color.background.subtle}
    ${CreditStatus.COMING}  | ${computedTheme.designSystem.color.background.subtle}
    ${CreditStatus.ONGOING} | ${computedTheme.designSystem.color.background.default}
  `(
    'should return $expectedBackgroundColor for $status status',
    ({ status, expectedBackgroundColor }) => {
      expect(getBackgroundColor(computedTheme, status)).toEqual(expectedBackgroundColor)
    }
  )
})
