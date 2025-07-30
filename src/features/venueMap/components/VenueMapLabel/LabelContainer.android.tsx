import styled from 'styled-components/native'

import { MARKER_LABEL_MARGIN_TOP } from 'features/venueMap/constant'
import { getSpacing } from 'ui/theme'

export const LabelContainer = styled.View(({ theme }) => {
  return {
    backgroundColor: theme.designSystem.color.background.default,
    borderRadius: theme.designSystem.size.borderRadius.s,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1),
    marginTop: MARKER_LABEL_MARGIN_TOP,
  }
})
