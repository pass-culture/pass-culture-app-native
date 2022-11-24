import colorAlpha from 'color-alpha'
import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/components/CreditBlock'

export const getBackgroundColor = (theme: DefaultTheme, status: CreditStatus) => {
  switch (status) {
    case CreditStatus.GONE:
      return colorAlpha(theme.colors.greyLight, 0.5)
    case CreditStatus.COMING:
      return theme.colors.greyLight
    case CreditStatus.ONGOING:
    default:
      return theme.colors.white
  }
}
