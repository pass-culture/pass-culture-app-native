import React from 'react'

import { Invalidate } from 'ui/svg/icons/Invalidate'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum } from 'ui/theme'

interface Props extends Omit<IconInterface, 'testID'> {
  isValid: boolean
  validtestID?: string
  invalidTestID?: string
}
export const ValidationMark: React.FC<Props> = ({ isValid, size, validtestID, invalidTestID }) => {
  return isValid ? (
    <Validate size={size} color={ColorsEnum.GREEN_VALID} testID={validtestID} />
  ) : (
    <Invalidate size={size} color={ColorsEnum.GREY_DARK} testID={invalidTestID} />
  )
}
