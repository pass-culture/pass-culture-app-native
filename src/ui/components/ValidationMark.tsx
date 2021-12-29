import React from 'react'

// TODO(antoinewg): replace this icon along with Validate
import { Invalidate } from 'ui/svg/icons/Invalidate_deprecated'
import { IconInterface } from 'ui/svg/icons/types'
import { ValidateDeprecated as Validate } from 'ui/svg/icons/Validate_deprecated'

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
