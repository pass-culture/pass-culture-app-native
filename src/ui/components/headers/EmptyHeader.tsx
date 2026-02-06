import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { BackButton } from 'ui/components/headers/BackButton'
import { Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  onGoBack?: () => void
}

export const EmptyHeader = ({ onGoBack }: Props) => {
  const { designSystem } = useTheme()
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...homeNavigationConfig)
  const HEADER_HEIGHT = designSystem.size.spacing.xxxxl

  return (
    <React.Fragment>
      <TopSpacer top={top} headerHeight={HEADER_HEIGHT} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer headerHeight={HEADER_HEIGHT}>
          <BackButton onGoBack={onGoBack ?? goBack} color={designSystem.color.icon.default} />
        </GoBackContainer>
      </HeaderContainer>
    </React.Fragment>
  )
}

const TopSpacer = styled.View<{ top: number; headerHeight: number }>(({ top, headerHeight }) => {
  return {
    height: headerHeight + top,
  }
})

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
}))

const GoBackContainer = styled.View<{ headerHeight: number }>(({ theme, headerHeight }) => ({
  justifyContent: 'center',
  height: headerHeight,
  paddingHorizontal: theme.designSystem.size.spacing.m,
}))
