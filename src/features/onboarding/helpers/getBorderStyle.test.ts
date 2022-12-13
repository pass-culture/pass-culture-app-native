import colorAlpha from 'color-alpha'

import { getBorderStyle } from 'features/onboarding/helpers/getBorderStyle'
import { CreditStatus } from 'features/onboarding/types'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

const EDGE_BLOCK_BORDER_RADIUS = getSpacing(2)
const defaultBorderStyle = {
  borderColor: theme.colors.greyLight,
  borderWidth: getSpacing(0.25),
  borderRadius: getSpacing(0.5),
  borderTopLeftRadius: undefined,
  borderTopRightRadius: undefined,
  borderBottomLeftRadius: undefined,
  borderBottomRightRadius: undefined,
}

describe('getBorderStyle', () => {
  it.each`
    status                  | expectedBorderStyle
    ${CreditStatus.GONE}    | ${{ ...defaultBorderStyle, borderColor: colorAlpha(theme.colors.greyLight, 0.5) }}
    ${CreditStatus.COMING}  | ${defaultBorderStyle}
    ${CreditStatus.ONGOING} | ${{ ...defaultBorderStyle, borderColor: theme.colors.greySemiDark }}
    ${undefined}            | ${{ ...defaultBorderStyle, borderColor: colorAlpha(theme.colors.greyLight, 0.5) }}
  `('should return expected style for $status status', ({ status, expectedBorderStyle }) => {
    expect(getBorderStyle(theme, status)).toEqual(expectedBorderStyle)
  })

  it.each<'top' | 'bottom'>(['top', 'bottom'])(
    'should round %s corners when roundedBorders is %s',
    (roundedBorders) => {
      const capitalizedroundedBorders = roundedBorders[0].toUpperCase() + roundedBorders.slice(1)

      expect(getBorderStyle(theme, CreditStatus.GONE, roundedBorders)).toMatchObject({
        [`border${capitalizedroundedBorders}LeftRadius`]: EDGE_BLOCK_BORDER_RADIUS,
        [`border${capitalizedroundedBorders}RightRadius`]: EDGE_BLOCK_BORDER_RADIUS,
      })
    }
  )
})
