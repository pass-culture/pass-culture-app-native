import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { getSpacing, getShadow } from 'ui/theme'

import { useCustomSafeInsets } from '../../../ui/theme/useCustomSafeInsets'

export const TabBarContainer = ({ children }: { children: React.ReactNode }) => {
  const { bottom } = useCustomSafeInsets()
  const netInfo = useNetInfoContext()
  return (
    <MainContainer accessibilityRole={AccessibilityRole.NAVIGATION}>
      <RowContainer>{children}</RowContainer>
      <SafeAreaPlaceholder safeHeight={netInfo.isConnected ? bottom : 0} />
    </MainContainer>
  )
}

const RowContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))
const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))

const MainContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  borderTopStyle: 'solid',
  borderTopWidth: getSpacing(1 / 4),
  borderTopColor: theme.designSystem.color.border.default,
  width: '100%',
  position: 'absolute',
  bottom: 0,

  ...getShadow(theme),
}))
