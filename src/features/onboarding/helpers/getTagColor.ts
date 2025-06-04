import { DefaultTheme } from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'

export const getTagColor = (theme: DefaultTheme, status: CreditStatus) => {
  switch (status) {
    case CreditStatus.GONE:
      return theme.designSystem.color.background.disabled
    case CreditStatus.ONGOING:
      return theme.designSystem.color.background.success
    case CreditStatus.COMING:
      return theme.designSystem.color.background.lockedBrandSecondary
    default:
      return theme.designSystem.color.background.default
  }
}
