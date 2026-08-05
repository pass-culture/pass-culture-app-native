import React, { forwardRef } from 'react'
import { TouchableWithoutFeedbackProps } from 'react-native'
import styled from 'styled-components'

const StyledTouchableWithoutFeedback = styled.button.attrs<TouchableWithoutFeedbackProps>(
  ({ onClick, testID, accessibilityLabel, style, ...rest }) => ({
    tabIndex: -1,
    onClick,
    'data-testid': accessibilityLabel || testID,
    'aria-label': accessibilityLabel,
    title: accessibilityLabel,
    style: style ?? undefined,
    ...rest,
  })
)({
  borderWidth: 0,
  backgroundColor: 'transparent',
  padding: 0,
  textAlign: 'left',
})

export const TouchableWithoutFeedback = forwardRef<
  HTMLButtonElement,
  TouchableWithoutFeedbackProps
>(({ onPress, ...rest }, ref) => (
  /*
    We can't export styled.button.attrs directly,
    despite the Props type given to attrs,
    Styled would log the following warning in the tests :
    Warning: Unknown event handler property `onPress`. It will be ignored.
    */
  // @ts-ignore bug with typescript
  <StyledTouchableWithoutFeedback ref={ref} onClick={onPress} {...rest} />
))

TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback'
