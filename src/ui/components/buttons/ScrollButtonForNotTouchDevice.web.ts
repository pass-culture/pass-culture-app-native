import styled from 'styled-components'

import {
  scrollButtonWebStyles,
  scrollButtonAriaDescribedBy,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'

export const ScrollButtonForNotTouchDevice =
  styled.button.attrs<ScrollButtonForNotTouchDeviceProps>(({ horizontalAlign, onPress }) => ({
    type: 'button',
    onClick: onPress,
    ['aria-describedby']: scrollButtonAriaDescribedBy({ horizontalAlign }),
  }))<ScrollButtonForNotTouchDeviceProps>(scrollButtonWebStyles)
