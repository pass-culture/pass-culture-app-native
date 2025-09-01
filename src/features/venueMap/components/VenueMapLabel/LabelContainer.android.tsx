import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const LabelContainer = styled.View(({ theme }) => {
  return {
    backgroundColor: theme.designSystem.color.background.default,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: theme.designSystem.size.spacing.s,
    paddingVertical: theme.designSystem.size.spacing.xs,
  }
})
