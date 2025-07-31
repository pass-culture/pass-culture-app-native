import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const MovieCalendarBottomBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: theme.designSystem.size.spacing.xs,
  borderRadius: getSpacing(1),
  width: '100%',
  backgroundColor: theme.designSystem.color.background.subtle,
}))
