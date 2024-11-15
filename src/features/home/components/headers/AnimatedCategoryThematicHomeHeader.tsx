import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

export const MOBILE_HEADER_HEIGHT = 45

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

const AppV1Header: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAnimatedHeight,
  gradientTranslation,
}) => {
  return (
    <Container testID="animated-thematic-header-v1">
      <AnimatedImage source={{ uri: imageUrl }} height={imageAnimatedHeight} />
      <TextContainer>
        <AnimatedBlackGradient
          height={getSpacing(MOBILE_HEADER_HEIGHT)}
          style={{ transform: [{ translateY: gradientTranslation }] }}
        />
        <AnimatedBlackBackground style={{ transform: [{ translateY: gradientTranslation }] }}>
          {subtitle ? (
            <React.Fragment>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          ) : null}
          <Title numberOfLines={2}>{title}</Title>
        </AnimatedBlackBackground>
      </TextContainer>
    </Container>
  )
}

type AppV2HeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppV2Header: FunctionComponent<AppV2HeaderProps> = ({
  title,
  subtitle,
  imageAnimatedHeight,
  color,
  gradientTranslation,
}) => {
  return (
    <Container testID="animated-thematic-header-v2">
      <AnimatedImage
        source={color ? gradientImagesMapping[color] : null}
        height={imageAnimatedHeight}
        resizeMode="stretch"
      />
      <TextContainer>
        <AnimatedBackground style={{ transform: [{ translateY: gradientTranslation }] }}>
          {subtitle ? (
            <React.Fragment>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          ) : null}
          <TypoDS.Title1 numberOfLines={2}>{title}</TypoDS.Title1>
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
  imageUrl,
  imageAnimatedHeight,
  gradientTranslation,
  color,
}) => {
  const enableAppV2Header = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_THEMATIC_HOME_HEADER)
  return enableAppV2Header ? (
    <AppV2Header
      title={title}
      subtitle={subtitle}
      imageAnimatedHeight={imageAnimatedHeight}
      gradientTranslation={gradientTranslation}
      color={color}
    />
  ) : (
    <AppV1Header
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
      imageAnimatedHeight={imageAnimatedHeight}
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

const StyledImage = styled.Image<{
  height: number
}>(({ height }) => ({
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
}))

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(6),
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(TypoDS.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const AnimatedImage = Animated.createAnimatedComponent(StyledImage)
const AnimatedBlackBackground = Animated.createAnimatedComponent(BlackBackground)
const AnimatedBlackGradient = Animated.createAnimatedComponent(BlackGradient)
const AnimatedBackgroundSubscribeButton = Animated.createAnimatedComponent(SubscribeButtonContainer)

const AnimatedBackground = styled(AnimatedBlackBackground)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0),
}))
