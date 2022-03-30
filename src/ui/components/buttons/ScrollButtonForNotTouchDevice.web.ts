import styled from 'styled-components'

import {
  scrollButtonWebStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'

export const ScrollButtonForNotTouchDevice =
  styled.button.attrs<ScrollButtonForNotTouchDeviceProps>(({ onPress }) => ({
    type: 'button',
    onClick: onPress,
    tabIndex: '-1',
    ['aria-hidden']: true,
  }))<ScrollButtonForNotTouchDeviceProps>(scrollButtonWebStyles)
