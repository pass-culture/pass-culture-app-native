import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'

const StyledPage = styled.View<{ isLandscape: boolean }>(({ theme, isLandscape }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  flex: 1,
  marginHorizontal: isLandscape ? theme.designSystem.size.spacing.xxxxl : 0,
}))

export const Page: React.FC<ViewProps> = ({ children, ...rest }) => {
  const isLandscape = useIsLandscape()
  return (
    <StyledPage isLandscape={isLandscape} {...rest}>
      {children}
    </StyledPage>
  )
}
