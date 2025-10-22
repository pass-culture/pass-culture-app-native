import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

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
  const { designSystem, icons } = useTheme()
  return (
    <Icon
      testID={testID}
      color={designSystem.color.icon.disabled}
      size={icons.sizes.standard}
      transform="translate(0 6) rotate(-8) scale(0.97)"
    />
  )
}
