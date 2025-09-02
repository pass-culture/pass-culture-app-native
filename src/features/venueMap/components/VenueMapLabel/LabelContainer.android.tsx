import styled from 'styled-components/native'

import { MARKER_LABEL_MARGIN_TOP, MARKER_SIZE } from 'features/venueMap/constant'
import { getSpacing } from 'ui/theme'

export const LabelContainer = styled.View(({ theme }) => {
  return {
    backgroundColor: theme.designSystem.color.background.default,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: theme.designSystem.size.spacing.s,
    paddingVertical: theme.designSystem.size.spacing.xs,
    height: '100%',
    marginTop: MARKER_SIZE.height + MARKER_LABEL_MARGIN_TOP,
  }
})
