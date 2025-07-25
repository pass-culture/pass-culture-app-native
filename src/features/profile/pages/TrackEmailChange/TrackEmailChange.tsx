import React from 'react'
import { Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const HEADER_HEIGHT = getSpacing(8)

export function TrackEmailChange() {
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  return (
    <StyledScrollViewContainer>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton onGoBack={goBack} />
        </GoBackContainer>
      </HeaderContainer>
      <StyledTitleText>Suivi de ton changement d’e-mail</StyledTitleText>
      <TrackEmailChangeContent />
    </StyledScrollViewContainer>
  )
}

const TopSpacer = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
  marginBottom: getSpacing(6),
}))

const GoBackContainer = styled.View({
  justifyContent: 'center',
  height: HEADER_HEIGHT,
})
const StyledScrollViewContainer = styled(ScrollView)({
  padding: getSpacing(6),
  overflow: 'hidden',
  flex: 1,
})

const StyledTitleText = styled(Typo.Title1)({
  ...(Platform.OS === 'web' ? { textAlign: 'center' } : {}),
})
