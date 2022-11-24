import { CreditStatus } from 'features/onboarding/components/CreditBlock'
import { getBorderStyle } from 'features/onboarding/helpers/getBorderStyle'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

const EDGE_BLOCK_BORDER_RADIUS = getSpacing(2)
const defaultBorderStyle = {
  borderColor: theme.colors.transparent,
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
    ${CreditStatus.GONE}    | ${defaultBorderStyle}
    ${CreditStatus.COMING}  | ${defaultBorderStyle}
    ${CreditStatus.ONGOING} | ${{ ...defaultBorderStyle, borderColor: theme.colors.greySemiDark }}
  `('should return expected style for $status status', ({ status, expectedBorderStyle }) => {
    expect(getBorderStyle(theme, status)).toEqual(expectedBorderStyle)
  })

  it.each<'top' | 'bottom'>(['top', 'bottom'])(
    'should round %s corners when position is %s',
    (position) => {
      const capitalizedPosition = position[0].toUpperCase() + position.slice(1)

      expect(getBorderStyle(theme, CreditStatus.GONE, position)).toMatchObject({
        [`border${capitalizedPosition}LeftRadius`]: EDGE_BLOCK_BORDER_RADIUS,
        [`border${capitalizedPosition}RightRadius`]: EDGE_BLOCK_BORDER_RADIUS,
      })
    }
  )
})
