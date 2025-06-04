import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'

export const getBackgroundColor = (theme: DefaultTheme, status: CreditStatus) => {
  switch (status) {
    case CreditStatus.GONE:
    case CreditStatus.COMING:
      return theme.designSystem.color.background.subtle
    case CreditStatus.ONGOING:
    default:
      return theme.designSystem.color.background.default
  }
}
