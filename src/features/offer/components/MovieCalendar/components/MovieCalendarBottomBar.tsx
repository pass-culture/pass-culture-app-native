import styled from 'styled-components/native'

export const MovieCalendarBottomBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.borderRadius.s,
  width: '100%',
  backgroundColor: theme.designSystem.color.background.subtle,
}))
