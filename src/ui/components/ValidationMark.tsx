import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Invalidate } from 'ui/svg/icons/Invalidate'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'

interface Props extends Omit<IconInterface, 'testID'> {
  isValid: boolean
  validtestID?: string
  invalidTestID?: string
}

export const ValidationMark: React.FC<Props> = ({ isValid, size, validtestID, invalidTestID }) => {
  const {
    colors: { white },
  } = useTheme()
  return isValid ? (
    <ValidateGreenValid size={size} testID={validtestID} />
  ) : (
    <InvalidateGreyDark size={size} testID={invalidTestID} backgroundColor={white} />
  )
}

const ValidateGreenValid = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.greenValid,
  accessibilityLabel: 'Accessible',
}))``

const InvalidateGreyDark = styled(Invalidate).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  accessibilityLabel: 'Non accessible',
}))``
