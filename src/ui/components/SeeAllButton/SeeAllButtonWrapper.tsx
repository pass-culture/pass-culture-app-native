import React, { PropsWithChildren } from 'react'
import styled, { useTheme } from 'styled-components/native'

export const SeeAllButtonWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { isDesktopViewport } = useTheme()
  return (
    <Container>
      {isDesktopViewport ? <TitleSeparator /> : null}
      {children}
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const TitleSeparator = styled.View(({ theme }) => ({
  width: 1,
  height: theme.designSystem.size.spacing.xl,
  backgroundColor: theme.designSystem.color.border.subtle,
  marginRight: theme.designSystem.size.spacing.l,
  alignSelf: 'center',
}))
