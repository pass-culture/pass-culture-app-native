import { useNavigation } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useCallback } from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'

import {
  HEADER_BLACK_BACKGROUND_HEIGHT,
  THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY,
} from 'features/home/components/constants'
import { ThematicHighlightGradient } from 'features/home/components/ThematicHighlightGradient'
import { CategoryThematicHeader } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

const HEADER_HEIGHT = getSpacing(44)

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <ImageBackground source={{ uri: imageUrl }} statusBarHeight={top}>
        <StatusBar barStyle="light-content" animated />
        <Spacer.TopScreen />
        <BackButtonContainer statusBarHeight={top}>
          <BackButton onGoBack={onGoBack} />
        </BackButtonContainer>
        <TextContainer>
          <ThematicHighlightGradient height={HEADER_BLACK_BACKGROUND_HEIGHT} />
          <BlackBackground>
            <TitleContainer>
              <Title numberOfLines={2}>{title}</Title>
              {!!subtitle && (
                <React.Fragment>
                  <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
                  <Spacer.Column numberOfSpaces={1} />
                </React.Fragment>
              )}
            </TitleContainer>
          </BlackBackground>
        </TextContainer>
      </ImageBackground>
    </React.Fragment>
  )
}

const ImageBackground = styled.ImageBackground<{ statusBarHeight: number }>(
  ({ statusBarHeight }) => ({
    height: HEADER_HEIGHT + statusBarHeight,
    marginBottom: getSpacing(6),
  })
)

const BackButtonContainer = styled.View<{ statusBarHeight: number }>(
  ({ statusBarHeight, theme }) => ({
    position: 'absolute',
    borderRadius: theme.borderRadius.button,
    background: theme.colors.white,
    width: getSpacing(10),
    top: statusBarHeight + getSpacing(4),
    left: getSpacing(4),
    zIndex: theme.zIndex.floatingButton,
  })
)

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY),
}))

const TitleContainer = styled.View(({ theme }) => ({
  // The size of the title block should not exceed two lines of title and one of subtitle
  maxHeight:
    parseInt(theme.typography.title1.lineHeight) * 2 +
    getSpacing(1) +
    parseInt(theme.typography.title4.lineHeight),
  overflow: 'hidden',
}))
