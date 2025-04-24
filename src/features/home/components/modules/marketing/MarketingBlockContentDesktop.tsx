import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { MarketingBlockProps } from 'features/home/components/modules/marketing/types'
import { BlurAmount } from 'ui/components/BlurryWrapper/BlurAmount'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { All } from 'ui/svg/icons/bicolor/All'
import { getSpacing } from 'ui/theme'

export const MarketingBlockContentDesktop = ({
  navigateTo,
  onBeforeNavigate,
  AttachedCardComponent,
  backgroundImageUrl,
  accessibilityLabel,
  withGradient,
  gradientHeight,
}: MarketingBlockProps) => {
  return (
    <View testID="MarketingBlockContentDesktop">
      <Container>
        <BackgroundImageContainer>
          {backgroundImageUrl ? (
            <SmallImageBackground source={{ uri: backgroundImageUrl }}>
              {withGradient ? (
                <BlackGradient height={gradientHeight} testID="black-gradient" />
              ) : null}
            </SmallImageBackground>
          ) : (
            <ImagePlaceholder>
              {withGradient ? (
                <BlackGradient height={gradientHeight} testID="black-gradient" />
              ) : null}
              <StyledAll />
            </ImagePlaceholder>
          )}
        </BackgroundImageContainer>
        <StyledTouchableLink
          navigateTo={navigateTo}
          onBeforeNavigate={onBeforeNavigate}
          accessibilityLabel={accessibilityLabel}>
          <AttachedOfferCardContainer>{AttachedCardComponent}</AttachedOfferCardContainer>
        </StyledTouchableLink>
      </Container>
      <BackgroundContainer>
        {backgroundImageUrl ? (
          <BigImageBackground source={{ uri: backgroundImageUrl }}>
            {withGradient ? (
              <BlackGradient height="100%" testID="black-gradient">
                <StyledBlurryWrapper blurAmount={BlurAmount.INTENSE} />
              </BlackGradient>
            ) : (
              <StyledBlurryWrapper blurAmount={BlurAmount.INTENSE} />
            )}
          </BigImageBackground>
        ) : (
          <BackgroundImagePlaceholder>
            <BlackGradient height="100%" />
          </BackgroundImagePlaceholder>
        )}
      </BackgroundContainer>
    </View>
  )
}

const StyledBlurryWrapper = styled(BlurryWrapper)({
  height: '100%',
  width: '100%',
})

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  margin: 'auto',
})

const BackgroundImageContainer = styled.View(({ theme }) => ({
  height: getSpacing(118.75),
  width: getSpacing(93.75),
  backgroundColor: theme.colors.greyLight,
  overflow: 'hidden',
  borderRadius: getSpacing(2),
}))

const ImagePlaceholder = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const BigImageBackground = styled.ImageBackground({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
})

const SmallImageBackground = styled(BigImageBackground)({
  borderRadius: getSpacing(2),
})

const BackgroundImagePlaceholder = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  flex: 1,
}))

const AttachedOfferCardContainer = styled.View({
  width: getSpacing(94),
})

const StyledTouchableLink = styled(InternalTouchableLink)({
  marginLeft: getSpacing(10),
  flex: 1,
})

const BackgroundContainer = styled.View({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  paddingVertical: getSpacing(10),
  zIndex: -5,
})

const StyledAll = styled(All).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.small,
  color: theme.colors.greyMedium,
}))``
