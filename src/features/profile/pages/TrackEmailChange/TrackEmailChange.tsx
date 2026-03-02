import React from 'react'
import { Platform, ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { Button } from 'ui/designSystem/Button/Button'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export function TrackEmailChange() {
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { designSystem } = useTheme()
  const HEADER_HEIGHT = designSystem.size.spacing.xxl

  return (
    <StyledScrollViewContainer>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer height={HEADER_HEIGHT}>
          <Button
            iconButton
            variant="tertiary"
            color="neutral"
            icon={ArrowPrevious}
            onPress={goBack}
            accessibilityLabel="Revenir en arrière"
          />
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
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const GoBackContainer = styled.View<{ height: number }>(({ height }) => ({
  justifyContent: 'center',
  height,
}))

const StyledScrollViewContainer = styled(ScrollView)(({ theme }) => ({
  padding: theme.designSystem.size.spacing.xl,
  overflow: 'hidden',
  flex: 1,
}))

const StyledTitleText = styled(Typo.Title1)({
  ...(Platform.OS === 'web' ? { textAlign: 'center' } : {}),
})
