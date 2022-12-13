import colorAlpha from 'color-alpha'
import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'

export const getBackgroundColor = (theme: DefaultTheme, status?: CreditStatus) => {
  switch (status) {
    case CreditStatus.COMING:
      return theme.colors.greyLight
    case CreditStatus.ONGOING:
      return theme.colors.white
    case CreditStatus.GONE:
    default:
      return colorAlpha(theme.colors.greyLight, 0.5)
  }
}
