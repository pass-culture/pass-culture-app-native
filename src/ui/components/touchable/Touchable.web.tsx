import React from 'react'
import styled from 'styled-components'

import { appTouchableOpacityWebStyles } from 'ui/components/buttons/AppButton/styleUtils'

import { TouchableProps } from './types'

const StyledTouchable = styled.button.attrs<TouchableProps>(
  ({ onClick, type, testID, accessibilityLabel, ...rest }) => ({
    tabIndex: '0',
    type: type || 'button',
    onClick,
    'data-testid': testID,
    'aria-label': accessibilityLabel,
    title: accessibilityLabel,
    ...rest,
  })
)(appTouchableOpacityWebStyles)

export const Touchable: React.FC<TouchableProps> = ({ onPress, ...rest }) => (
  // @ts-ignore bug with typescript
  <StyledTouchable onClick={onPress} {...rest} />
)
