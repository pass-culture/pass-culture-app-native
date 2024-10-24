import styled from 'styled-components/native'

import { MARKER_LABEL_MARGIN_TOP } from 'features/venueMap/components/VenueMapView/constant'
import { getSpacing } from 'ui/theme'

export const LabelContainer = styled.View(({ theme }) => {
  return {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1),
    marginTop: MARKER_LABEL_MARGIN_TOP,
  }
})
