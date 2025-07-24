import React, { FunctionComponent } from 'react'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepDoneProps {
  Icon: FunctionComponent<AccessibleIcon>
  testID?: string
}

export const IconStepDisabled: FunctionComponent<IconStepDoneProps> = ({ Icon, testID }) => {
  return (
    <Icon
      testID={testID}
      color={theme.designSystem.color.icon.disabled}
      size={theme.icons.sizes.small}
    />
  )
}
