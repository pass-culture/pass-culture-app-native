import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'
import { getSpacing } from 'ui/theme'

const EDGE_BLOCK_BORDER_RADIUS = getSpacing(2)
export const getBorderStyle = (
  theme: DefaultTheme,
  status: CreditStatus,
  position?: 'top' | 'bottom'
) => {
  const topRadius = position === 'top' ? EDGE_BLOCK_BORDER_RADIUS : undefined
  const bottomRadius = position === 'bottom' ? EDGE_BLOCK_BORDER_RADIUS : undefined
  return {
    borderColor:
      status === CreditStatus.ONGOING ? theme.colors.greySemiDark : theme.colors.transparent,
    borderWidth: getSpacing(0.25),
    borderRadius: getSpacing(0.5),
    borderTopLeftRadius: topRadius,
    borderTopRightRadius: topRadius,
    borderBottomLeftRadius: bottomRadius,
    borderBottomRightRadius: bottomRadius,
  }
}
