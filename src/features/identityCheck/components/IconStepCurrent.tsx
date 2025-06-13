import React, { FunctionComponent } from 'react'

import { theme } from 'theme'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepDoneProps {
  Icon: FunctionComponent<AccessibleIcon>
  testID?: string
}

export const IconStepCurrent: FunctionComponent<IconStepDoneProps> = ({ Icon, testID }) => {
  return (
    <Icon
      testID={testID}
      color={theme.designSystem.color.icon.brandPrimary}
      size={theme.icons.sizes.standard}
    />
  )
}
