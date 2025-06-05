import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { HomeGradient } from 'ui/svg/HomeGradient'
import { getSpacing, Typo } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

export const MOBILE_HEADER_HEIGHT = 45

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

type AppHeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppHeader: FunctionComponent<AppHeaderProps> = ({
  title,
  subtitle,
  color,
  gradientTranslation,
}) => {
  return (
    <Container>
      <HomeGradient
        colors={gradientImagesMapping[color]}
        testID="HomeGradient"
        height={getSpacing(MOBILE_HEADER_HEIGHT)}
      />
      <TextContainer>
        <AnimatedBackground style={{ transform: [{ translateY: gradientTranslation }] }}>
          {subtitle ? (
            <ViewGap gap={1}>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
            </ViewGap>
          ) : null}
          <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
        </AnimatedBackground>
      </TextContainer>
      <AnimatedBackgroundSubscribeButton
        style={{ transform: [{ translateY: gradientTranslation }] }}
      />
    </Container>
  )
}

export const AnimatedCategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  gradientTranslation,
  color,
}) => {
  return (
    <AppHeader
      title={title}
      subtitle={subtitle}
      gradientTranslation={gradientTranslation}
      color={color}
    />
  )
}

const Container = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: getSpacing(MOBILE_HEADER_HEIGHT),
})

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(6),
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
  marginBottom: getSpacing(1),
}))

const AnimatedBlackBackground = Animated.createAnimatedComponent(BlackBackground)

const AnimatedBackgroundSubscribeButton = Animated.createAnimatedComponent(SubscribeButtonContainer)

const AnimatedBackground = styled(AnimatedBlackBackground)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0),
}))
