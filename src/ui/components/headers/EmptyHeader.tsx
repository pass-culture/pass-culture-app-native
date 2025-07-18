import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const HEADER_HEIGHT = getSpacing(12)

interface Props {
  onGoBack?: () => void
}

export const EmptyHeader = ({ onGoBack }: Props) => {
  const { designSystem } = useTheme()
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...homeNavigationConfig)
  return (
    <React.Fragment>
      <TopSpacer top={top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton onGoBack={onGoBack ?? goBack} color={designSystem.color.icon.default} />
        </GoBackContainer>
      </HeaderContainer>
    </React.Fragment>
  )
}

const TopSpacer = styled.View<{ top: number }>(({ top }) => ({
  height: HEADER_HEIGHT + top,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
}))

const GoBackContainer = styled.View({
  justifyContent: 'center',
  height: HEADER_HEIGHT,
  paddingHorizontal: getSpacing(3),
})
