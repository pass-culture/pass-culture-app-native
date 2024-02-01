import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

import {
  scrollButtonWebStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'

export const ScrollButtonForNotTouchDevice: FunctionComponent<
  ScrollButtonForNotTouchDeviceProps
> = ({ onPress, ...props }) => <StyledButton onClick={onPress} {...props} />

const StyledButton = styled.button.attrs<ScrollButtonForNotTouchDeviceProps>({
  type: 'button',
  tabIndex: '-1',
  ['aria-hidden']: true,
})<ScrollButtonForNotTouchDeviceProps>(scrollButtonWebStyles)
