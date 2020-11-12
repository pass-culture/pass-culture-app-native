import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { useTabBarHeight } from '../../features/navigation/TabBar/useTabBarHeight'

interface SafeContainerInterface {
  noTabBarSpacing?: boolean
}
/**
 * Wrap pages with this container
 * to prevent the status bar from overlapping
 * with the application.
 */
export const SafeContainer: React.FC<SafeContainerInterface> = ({
  children,
  noTabBarSpacing = false,
}) => {
  const tabBarHeight = useTabBarHeight()
  return (
    <StyledSafeAreaView marginBottom={noTabBarSpacing ? 0 : tabBarHeight}>
      {children}
    </StyledSafeAreaView>
  )
}
const StyledSafeAreaView = styled(SafeAreaView).attrs({
  edges: ['top'],
  mode: 'padding',
})<{ marginBottom: number }>(({ marginBottom }) => ({
  flex: 1,
  marginBottom,
}))
