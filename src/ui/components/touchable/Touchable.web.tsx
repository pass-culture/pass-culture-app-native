import React from 'react'
import styled from 'styled-components'

import { appTouchableOpacityWebStyles } from 'ui/components/buttons/AppButton/styleUtils'

import { TouchableProps } from './types'

const StyledTouchable = styled.button.attrs<TouchableProps>(
  ({ onClick, type, testID, accessibilityLabel, ...rest }) => ({
    tabIndex: '0',
    type: type || 'button',
    onClick,
    'data-testid': accessibilityLabel || testID,
    'aria-label': accessibilityLabel,
    title: accessibilityLabel,
    ...rest,
  })
)(appTouchableOpacityWebStyles)

export const Touchable: React.FC<TouchableProps> = ({ onPress, ...rest }) => (
  /*
  We can't export styled.button.attrs directly,
  despite the Props type given to attrs,
  Styled would log the following warning in the tests :
  Warning: Unknown event handler property `onPress`. It will be ignored.
  */
  // @ts-ignore bug with typescript
  <StyledTouchable onClick={onPress} {...rest} />
)
