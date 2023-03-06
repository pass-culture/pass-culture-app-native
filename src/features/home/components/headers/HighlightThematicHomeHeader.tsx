import { useNavigation } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useCallback } from 'react'
import { StatusBar, View } from 'react-native'
import styled from 'styled-components/native'

import { THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { ThematicHighlightGradient } from 'features/home/components/ThematicHighlightGradient'
import { HighlightThematicHeader } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type HighligthThematicHeaderProps = Omit<HighlightThematicHeader, 'type'>

type IntroductionProps = {
  title: string
  paragraph: string
}

const DESKTOP_HEADER_HEIGHT = getSpacing(100)
const MOBILE_HEADER_HEIGHT = getSpacing(70)

export const HighlightThematicHomeHeader: FunctionComponent<HighligthThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  introductionTitle,
  introductionParagraph,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])

  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  const shouldShowIntroduction = !!introductionTitle && !!introductionParagraph

  return (
    <React.Fragment>
      <ImageBackground source={{ uri: imageUrl }}>
        <StatusBar barStyle="light-content" animated />
        <Spacer.TopScreen />
        <View>
          <BackButtonContainer>
            <BackButton onGoBack={onGoBack} />
          </BackButtonContainer>
          <DateRangeCaptionContainer>
            <DateRangeCaption>{dateRange}</DateRangeCaption>
          </DateRangeCaptionContainer>
        </View>
        <TextContainer>
          <ThematicHighlightGradient />
          <BlackBackground>
            {!!subtitle && (
              <React.Fragment>
                <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
                <Spacer.Column numberOfSpaces={1} />
              </React.Fragment>
            )}
            <Title numberOfLines={2}>{title}</Title>
          </BlackBackground>
        </TextContainer>
      </ImageBackground>
      {shouldShowIntroduction ? (
        <Introduction title={introductionTitle} paragraph={introductionParagraph} />
      ) : null}
    </React.Fragment>
  )
}

const Introduction = ({ title, paragraph }: IntroductionProps) => (
  <React.Fragment>
    <IntroductionContainer>
      <Typo.Title4 numberOfLines={3}>{title}</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>{paragraph}</Typo.Body>
    </IntroductionContainer>
    <Spacer.Column numberOfSpaces={6} />
    <Divider />
    <Spacer.Column numberOfSpaces={6} />
  </React.Fragment>
)

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  height: theme.isDesktopViewport ? DESKTOP_HEADER_HEIGHT : MOBILE_HEADER_HEIGHT,
  marginBottom: getSpacing(6),
}))

const BackButtonContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  borderRadius: theme.borderRadius.button,
  background: theme.colors.white,
  width: getSpacing(10),
  top: getSpacing(4),
  left: getSpacing(4),
}))

const DateRangeCaptionContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black,
  position: 'absolute',
  top: getSpacing(6),
  right: getSpacing(6),
  borderRadius: getSpacing(2),
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(2),
}))

const DateRangeCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY),
}))

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const IntroductionContainer = styled.View({
  paddingHorizontal: getSpacing(6),
})

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(1),
  backgroundColor: theme.colors.greyLight,
}))
