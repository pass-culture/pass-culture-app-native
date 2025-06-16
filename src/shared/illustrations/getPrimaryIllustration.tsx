import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'

export const getPrimaryIllustration = (illustration?: React.FC<AccessibleIcon>) => {
  if (illustration) {
    return styled(illustration).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.designSystem.color.icon.brandPrimary,
    }))``
  }
  return null
}
