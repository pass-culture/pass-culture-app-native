import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

export const MOBILE_HEADER_HEIGHT = 52

export const AnimatedCategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAnimatedHeight,
  gradientTranslation,
}) => {
  const AnimatedImage = Animated.createAnimatedComponent(StyledImage)
  const AnimatedBlackBackground = Animated.createAnimatedComponent(BlackBackground)
  const AnimatedBlackGradient = Animated.createAnimatedComponent(BlackGradient)

  return (
    <Container testID="animated-thematic-header">
      <AnimatedImage source={{ uri: imageUrl }} height={imageAnimatedHeight} />
      <TextContainer>
        <AnimatedBlackGradient
          height={getSpacing(MOBILE_HEADER_HEIGHT)}
          style={{ transform: [{ translateY: gradientTranslation }] }}
        />
        <AnimatedBlackBackground style={{ transform: [{ translateY: gradientTranslation }] }}>
          {!!subtitle && (
            <React.Fragment>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          )}
          <Title numberOfLines={2}>{title}</Title>
        </AnimatedBlackBackground>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: getSpacing(MOBILE_HEADER_HEIGHT),
})

const StyledImage = styled.Image<{
  height: number
}>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: height,
}))

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))
