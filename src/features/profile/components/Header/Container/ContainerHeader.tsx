import styled from 'styled-components/native'

export const ContainerHeader = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.xl,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: theme.designSystem.color.background.default,
  borderColor: theme.designSystem.color.border.default,
  borderWidth: 1,
  alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))
