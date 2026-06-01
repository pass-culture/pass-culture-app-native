import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const DefaultStepContainer = styled.View(({ theme }) => ({
  borderColor: theme.designSystem.color.border.default,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.designSystem.size.borderRadius.m,
  padding: theme.designSystem.size.spacing.l,
  overflow: 'hidden',
  marginVertical: theme.designSystem.size.spacing.m,
}))
