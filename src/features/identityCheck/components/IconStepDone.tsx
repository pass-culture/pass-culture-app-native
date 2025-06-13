import React, { FunctionComponent } from 'react'

import { theme } from 'theme'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepDoneProps {
  Icon: FunctionComponent<
    AccessibleIcon & {
      transform?: string
    }
  >
  testID?: string
}

export const IconStepDone: FunctionComponent<IconStepDoneProps> = ({ Icon, testID }) => {
  return (
    <Icon
      testID={testID}
      color={theme.designSystem.color.icon.disabled}
      size={theme.icons.sizes.standard}
      transform="translate(0 6) rotate(-8) scale(0.97)"
    />
  )
}
