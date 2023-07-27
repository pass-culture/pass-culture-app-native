import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BlurView } from 'ui/components/BlurView'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const StatusBarBlurredBackground = () => {
  const { top } = useCustomSafeInsets()

  // There is an issue with the blur on Android: we chose not to render it and use a white background
  return (
    <StatusBarContainer height={top}>
      {Platform.OS === 'android' ? <AndroidWhiteStatusBar /> : <BlurredStatusBar />}
    </StatusBarContainer>
  )
}

const BlurredStatusBar = styled(BlurView)({
  flex: 1,
})

const StatusBarContainer = styled.View<{ height: number }>(({ height }) => ({
  position: 'absolute',
  height,
  left: 0,
  right: 0,
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
}))

const AndroidWhiteStatusBar = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
