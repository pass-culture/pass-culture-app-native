import styled from 'styled-components'

import {
  scrollButtonWebStyles,
  scrollButtonAccessibilityLabel,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'

export const ScrollButtonForNotTouchDevice =
  styled.button.attrs<ScrollButtonForNotTouchDeviceProps>(({ horizontalAlign, onPress }) => ({
    tabIndex: '-1',
    type: 'button',
    onClick: onPress,
    ['aria-label']: scrollButtonAccessibilityLabel({ horizontalAlign }),
  }))<ScrollButtonForNotTouchDeviceProps>(scrollButtonWebStyles)
