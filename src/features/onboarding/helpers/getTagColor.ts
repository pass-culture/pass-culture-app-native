import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'

export const getTagColor = (theme: DefaultTheme, status: CreditStatus) => {
  switch (status) {
    case CreditStatus.GONE:
      return theme.colors.white
    case CreditStatus.ONGOING:
      return theme.colors.greenValid
    case CreditStatus.COMING:
      return theme.colors.secondary
    default:
      return theme.colors.white
  }
}
