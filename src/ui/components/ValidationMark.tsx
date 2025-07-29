import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Invalidate } from 'ui/svg/icons/Invalidate'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'

interface Props extends Omit<AccessibleIcon, 'testID'> {
  isValid: boolean
}

export const ValidationMark: React.FC<Props> = ({ isValid, size }) => {
  const { designSystem } = useTheme()
  return isValid ? (
    <ValidateGreenValid size={size} testID="valid-icon" />
  ) : (
    <InvalidateGreyDark
      size={size}
      testID="invalid-icon"
      backgroundColor={designSystem.color.background.default}
    />
  )
}

const ValidateGreenValid = styled(Validate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.success,
  accessibilityLabel: 'Accessible',
}))``

const InvalidateGreyDark = styled(Invalidate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  accessibilityLabel: 'Non accessible',
}))``
