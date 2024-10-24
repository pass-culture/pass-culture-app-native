import Animated from 'react-native-reanimated'
import styled from 'styled-components/native'

import {
  MARKER_LABEL_MARGIN_TOP,
  MARKER_SIZE,
} from 'features/venueMap/components/VenueMapView/constant'
import { Size } from 'features/venueMap/types'
import { getSpacing } from 'ui/theme'

export const LabelContainer = styled(Animated.View)<{ labelSize: Size }>(({ theme, labelSize }) => {
  return {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1),
    transform: `translateX(${MARKER_SIZE.width / 2 - labelSize.width / 2}px) translateY(${MARKER_SIZE.height + MARKER_LABEL_MARGIN_TOP}px)`,
  }
})
