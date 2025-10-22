import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepDoneProps {
  Icon: FunctionComponent<AccessibleIcon>
  testID?: string
}

export const IconStepDisabled: FunctionComponent<IconStepDoneProps> = ({ Icon, testID }) => {
  const { designSystem, icons } = useTheme()
  return <Icon testID={testID} color={designSystem.color.icon.disabled} size={icons.sizes.small} />
}
