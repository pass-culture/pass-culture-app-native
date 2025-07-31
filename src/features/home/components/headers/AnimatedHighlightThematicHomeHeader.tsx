import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { HighlightThematicHeader } from 'features/home/types'
import { Tag } from 'ui/components/Tag/Tag'
import { TagVariant } from 'ui/components/Tag/types'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type HighlightThematicHeaderProps = Omit<HighlightThematicHeader, 'type'>

export const MOBILE_HEADER_HEIGHT = 70

export const AnimatedHighlightThematicHomeHeader: FunctionComponent<
  HighlightThematicHeaderProps
> = ({
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  gradientTranslation,
  imageAnimatedHeight,
}) => {
  const { top } = useCustomSafeInsets()

  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  return (
    <Container testID="animated-thematic-header">
      <AnimatedImage source={{ uri: imageUrl }} height={imageAnimatedHeight || 0} />
      <DateRangeCaptionContainer statusBarHeight={top}>
        <Tag label={dateRange} variant={TagVariant.DEFAULT} />
      </DateRangeCaptionContainer>
      <TextContainer>
        <AnimatedBlackGradient
          height={HEADER_BLACK_BACKGROUND_HEIGHT}
          style={{ transform: [{ translateY: gradientTranslation || 0 }] }}
        />
        <AnimatedBlackBackground style={{ transform: [{ translateY: gradientTranslation || 0 }] }}>
          {subtitle ? <Subtitle numberOfLines={1}>{subtitle}</Subtitle> : null}
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

const DateRangeCaptionContainer = styled.View<{ statusBarHeight: number }>(
  ({ theme, statusBarHeight }) => ({
    position: 'absolute',
    zIndex: theme.zIndex.header,
    top: statusBarHeight + getSpacing(6),
    right: theme.designSystem.size.spacing.xl,
  })
)

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  marginBottom: theme.designSystem.size.spacing.xs,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const AnimatedImage = Animated.createAnimatedComponent(StyledImage)
const AnimatedBlackBackground = Animated.createAnimatedComponent(BlackBackground)
const AnimatedBlackGradient = Animated.createAnimatedComponent(BlackGradient)
