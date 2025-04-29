import colorAlpha from 'color-alpha'

import { CreditStatus } from 'features/onboarding/enums'
import { getBackgroundColor } from 'features/onboarding/helpers/getBackgroundColor'
import { computedTheme } from 'tests/computedTheme'

describe('getBackgroundColor', () => {
  it.each`
    status                  | expectedBackgroundColor
    ${CreditStatus.GONE}    | ${colorAlpha(computedTheme.colors.greyLight, 0.5)}
    ${CreditStatus.COMING}  | ${computedTheme.colors.greyLight}
    ${CreditStatus.ONGOING} | ${computedTheme.colors.white}
  `(
    'should return $expectedBackgroundColor for $status status',
    ({ status, expectedBackgroundColor }) => {
      expect(getBackgroundColor(computedTheme, status)).toEqual(expectedBackgroundColor)
    }
  )
})
