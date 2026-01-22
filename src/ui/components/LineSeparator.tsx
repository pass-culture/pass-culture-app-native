import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: getSpacing(6),
  marginVertical: theme.designSystem.size.spacing.l,
}))
