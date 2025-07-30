import Animated from 'react-native-reanimated'
import styled from 'styled-components/native'

import { MARKER_LABEL_MARGIN_TOP, MARKER_SIZE } from 'features/venueMap/constant'
import { Size } from 'features/venueMap/types'
import { getSpacing } from 'ui/theme'

export const LabelContainer = styled(Animated.View)<{ labelSize: Size }>(({ theme, labelSize }) => {
  return {
    backgroundColor: theme.designSystem.color.background.default,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: theme.designSystem.size.spacing.s,
    paddingVertical: theme.designSystem.size.spacing.xs,
    transform: `translateX(${MARKER_SIZE.width / 2 - labelSize.width / 2}px) translateY(${MARKER_SIZE.height + MARKER_LABEL_MARGIN_TOP}px)`,
  }
})
