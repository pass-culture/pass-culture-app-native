import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const StyledPage = styled.View<{ isLandscape: boolean }>(({ theme, isLandscape }) => {
  const { right, left } = useCustomSafeInsets()
  return {
    backgroundColor: theme.designSystem.color.background.default,
    flex: 1,
    marginRight: isLandscape ? right : 0,
    marginLeft: isLandscape ? left : 0,
  }
})

export const Page: React.FC<ViewProps> = ({ children, ...rest }) => {
  const isLandscape = useIsLandscape()
  return (
    <StyledPage isLandscape={isLandscape} {...rest}>
      {children}
    </StyledPage>
  )
}
