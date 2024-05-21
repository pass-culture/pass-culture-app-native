import React from 'react'
import styled from 'styled-components/native'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { getShadow, getSpacing, Spacer } from 'ui/theme'

import { useCustomSafeInsets } from '../../../ui/theme/useCustomSafeInsets'

export const TabBarContainer = ({ v2, children }: { v2: boolean; children: React.ReactNode }) => {
  const { bottom } = useCustomSafeInsets()
  const netInfo = useNetInfoContext()
  return (
    <MainContainer v2={v2}>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {children}
        <Spacer.Row numberOfSpaces={4} />
      </RowContainer>
      <SafeAreaPlaceholder safeHeight={netInfo.isConnected ? bottom : 0} />
    </MainContainer>
  )
}

const RowContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
})

const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))

const MainContainer = styled.View<{ v2: boolean }>(({ theme, v2 }) => ({
  alignItems: 'center',
  borderTopStyle: 'solid',
  borderTopWidth: getSpacing(1 / 4),
  borderTopColor: v2 ? theme.colors.greyMedium : theme.colors.greyLight,
  backgroundColor: theme.uniqueColors.tabBar,
  width: '100%',
  position: 'absolute',
  bottom: 0,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1 / 4),
    },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
  }),
}))
