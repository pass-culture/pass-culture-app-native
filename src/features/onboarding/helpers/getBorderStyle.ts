import { DefaultTheme } from 'styled-components/native'

import { getBackgroundColor } from 'features/onboarding/helpers/getBackgroundColor'
import { CreditStatus } from 'features/onboarding/types'
import { getSpacing } from 'ui/theme'

export const EDGE_BLOCK_BORDER_RADIUS = getSpacing(2)
export const CREDIT_BLOCK_BORDER_WIDTH = getSpacing(0.25)
export const getBorderStyle = (
  theme: DefaultTheme,
  status?: CreditStatus,
  roundedBorders?: 'top' | 'bottom'
) => {
  const topRadius = roundedBorders === 'top' ? EDGE_BLOCK_BORDER_RADIUS : undefined
  const bottomRadius = roundedBorders === 'bottom' ? EDGE_BLOCK_BORDER_RADIUS : undefined
  return {
    borderColor:
      status === CreditStatus.ONGOING
        ? theme.colors.greySemiDark
        : getBackgroundColor(theme, status),
    borderWidth: CREDIT_BLOCK_BORDER_WIDTH,
    borderRadius: getSpacing(0.5),
    borderTopLeftRadius: topRadius,
    borderTopRightRadius: topRadius,
    borderBottomLeftRadius: bottomRadius,
    borderBottomRightRadius: bottomRadius,
  }
}
