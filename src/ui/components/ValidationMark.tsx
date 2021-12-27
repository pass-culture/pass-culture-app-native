import React from 'react'

import { Invalidate } from 'ui/svg/icons/Invalidate_deprecated'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'

interface Props extends Omit<IconInterface, 'testID'> {
  isValid: boolean
  validtestID?: string
  invalidTestID?: string
}
export const ValidationMark: React.FC<Props> = ({
  isValid,
  size,
  color,
  validtestID,
  invalidTestID,
}) => {
  return isValid ? (
    <Validate size={size} color={color} testID={validtestID} />
  ) : (
    <Invalidate size={size} color={color} testID={invalidTestID} />
  )
}
