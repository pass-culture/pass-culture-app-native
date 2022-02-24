import React from 'react'
import styled from 'styled-components/native'

import { TouchableProps } from './types'

export const Touchable: React.FC<TouchableProps> = ({
  children,
  onPress,
  accessibilityLabel,
  testID,
}) => {
  return (
    <StyledTouchable onPress={onPress} testID={testID} accessibilityLabel={accessibilityLabel}>
      {children}
    </StyledTouchable>
  )
}

const StyledTouchable = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``
