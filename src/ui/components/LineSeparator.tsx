import styled from 'styled-components/native'

export const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginVertical: theme.designSystem.size.spacing.l,
}))
